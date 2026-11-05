/**
 * 首屏石头场景(纯 Three.js,不依赖 React)。
 * 只从 'three' 做具名导入,便于打包时摇树;本模块由 HeroScene 动态导入,不进入主包。
 */
import {
  AmbientLight,
  BufferAttribute,
  Color,
  DirectionalLight,
  Fog,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  WebGLRenderer,
  type BufferGeometry,
} from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** --sage = #C2CABB,背景与雾色 */
const SAGE_HEX = 0xc2cabb
const FOV = 35

/** 细分 32:合并顶点后 21,780 个三角面,低于 DESIGN.md 7.2 的 30k 预算 */
const ROCK_DETAIL = 32
const ROCK_RADIUS = 2

/**
 * 取景:石头中心在画面中的位置(px, py,0–1)与大小(fill)。
 * 横屏:石头在左侧,右侧 40% 留给文字;fill 指石头直径占视口高度的比例。
 * 竖屏:石头在上方,下半部留给文字;fill 指石头直径占视口宽度的比例。
 */
function framingFor(aspect: number) {
  return aspect >= 1 ? { px: 0.36, py: 0.47, fill: 0.62 } : { px: 0.5, py: 0.34, fill: 0.72 }
}

// ---- 程序噪声:3D 值噪声 + 分形叠加(fbm),固定种子,每次生成的石头相同 ----
function hash3(x: number, y: number, z: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123
  return h - Math.floor(h)
}
const smooth = (t: number) => t * t * (3 - 2 * t)
function valueNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const u = smooth(x - xi)
  const v = smooth(y - yi)
  const w = smooth(z - zi)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz)
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u)
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), u)
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u)
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), u)
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w) * 2 - 1 // -1..1
}
function fbm(x: number, y: number, z: number, octaves: number): number {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(x * freq, y * freq, z * freq) * amp
    freq *= 2.03
    amp *= 0.5
  }
  return sum
}

/**
 * 生成石头几何体,并写入两种顶点属性作为程序纹理:
 * - color:漫反射明暗,大尺度噪声决定岩面色块,凹陷处加深
 * - aRough:粗糙度系数,在着色器里乘到 roughness 上
 * 为什么用顶点属性而不是贴图:球面 UV 有接缝,3D 噪声直接按顶点位置取值没有这个问题。
 */
export function buildRockGeometry(): BufferGeometry {
  let geo: BufferGeometry = new IcosahedronGeometry(ROCK_RADIUS, ROCK_DETAIL)
  // 多面体几何默认不共享顶点(法线是平的);删掉法线和 UV 后合并顶点,才能得到平滑法线
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  geo = mergeVertices(geo)

  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const rough = new Float32Array(pos.count)
  const dark = new Color('#1d1f1b')
  const light = new Color('#55584f')
  const tmp = new Color()
  const floorY = -ROCK_RADIUS * 0.62 // 底面:压平成一个支撑面,石头能"坐"在地上

  for (let i = 0; i < pos.count; i++) {
    const len = Math.hypot(pos.getX(i), pos.getY(i), pos.getZ(i))
    const nx = pos.getX(i) / len
    const ny = pos.getY(i) / len
    const nz = pos.getZ(i) / len

    // 大形:低频噪声;细节:高频噪声
    const shape = fbm(nx * 1.1 + 3.1, ny * 1.1, nz * 1.1 - 2.3, 3)
    const detail = fbm(nx * 4.2, ny * 4.2 + 7.7, nz * 4.2, 4)
    const r = ROCK_RADIUS * (1 + shape * 0.32 + detail * 0.07)

    const x = nx * r
    let y = ny * r * 0.78 // 压扁成卵石状
    const z = nz * r * 1.08
    if (y < floorY) y = floorY + (y - floorY) * 0.2
    pos.setXYZ(i, x, y, z)

    // 漫反射:岩面色块 + 凹陷(细节噪声低处)加深
    const patch = fbm(nx * 2.6 - 5.1, ny * 2.6, nz * 2.6 + 1.7, 3) * 0.5 + 0.5
    const cavity = Math.min(Math.max(detail * 2.2 + 0.55, 0), 1)
    tmp.copy(dark).lerp(light, patch * 0.75).multiplyScalar(0.55 + cavity * 0.45)
    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b

    // 粗糙度系数 0.7–1.0:凸起处略光滑,像被磨过
    rough[i] = 0.7 + (1 - cavity) * 0.3
  }

  geo.setAttribute('color', new BufferAttribute(colors, 3))
  geo.setAttribute('aRough', new BufferAttribute(rough, 1))
  geo.computeVertexNormals()
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  return geo
}

/** 标准材质 + 顶点粗糙度:在 roughness 计算处乘上 aRough */
function createRockMaterial(): MeshStandardMaterial {
  const mat = new MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 })
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aRough;\nvarying float vRough;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRough = aRough;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vRough;')
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * vRough;')
  }
  return mat
}

export interface RockSceneOptions {
  canvas: HTMLCanvasElement
  /** 用于判断首屏是否在视口内;离开视口时暂停渲染 */
  container: HTMLElement
  /** 第一帧画完后调用,HeroScene 据此把画布淡入 */
  onFirstFrame?: () => void
}

export function createRockScene({ canvas, container, onFirstFrame }: RockSceneOptions): () => void {
  const scene = new Scene()
  scene.background = new Color(SAGE_HEX)
  scene.fog = new Fog(SAGE_HEX, 18, 60)

  const renderer = new WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  // ---- 石头 ----
  const geo = buildRockGeometry()
  const radius = geo.boundingSphere?.radius ?? 2.7
  const bottom = geo.boundingBox?.min.y ?? -2

  const mat = createRockMaterial()
  const rock = new Mesh(geo, mat)
  rock.castShadow = true
  scene.add(rock)

  // ---- 地面:只渲染阴影,背景色直接透出,和天空无缝 ----
  // 阴影强度 0.22:最深处为 #9BA295,墨色文字叠在上面仍有 7.17:1
  const groundGeo = new PlaneGeometry(radius * 12, radius * 12)
  const groundMat = new ShadowMaterial({ opacity: 0.22 })
  const ground = new Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = bottom - 0.02
  ground.receiveShadow = true
  scene.add(ground)

  // ---- 光照 ----
  scene.add(new AmbientLight(SAGE_HEX, 1.0))
  const sun = new DirectionalLight(0xffffff, 2.6)
  sun.position.set(radius * 2, radius * 3, radius * 2)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  const s = radius * 2.5
  sun.shadow.camera.left = -s
  sun.shadow.camera.right = s
  sun.shadow.camera.top = s
  sun.shadow.camera.bottom = -s
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = radius * 10
  sun.shadow.radius = 8
  scene.add(sun)

  // ---- 相机 ----
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100)
  const tanHalf = Math.tan((FOV * Math.PI) / 360)
  let distance = 10

  function resize() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    const aspect = w / h
    const { px, py, fill } = framingFor(aspect)
    renderer.setSize(w, h, false)
    camera.aspect = aspect
    // 让石头外接球在画面中占 fill 的比例
    distance = radius / (fill * tanHalf * Math.min(aspect, 1))
    // 把石头从画面正中移到 (px, py)
    camera.setViewOffset(w, h, (0.5 - px) * w, (0.5 - py) * h, w, h)
    camera.updateProjectionMatrix()
  }
  resize()

  // ---- 输入 ----
  let pointerX = 0
  let pointerY = 0
  let orbitX = 0
  let orbitY = 0
  let lift = 0
  const onPointerMove = (e: PointerEvent) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1
    pointerY = (e.clientY / window.innerHeight) * 2 - 1
  }
  const onScroll = () => {
    // 滚动一屏,石头上移约 0.4 个半径
    lift = Math.min(window.scrollY / window.innerHeight, 1) * radius * 0.4
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', resize)

  // ---- 渲染循环:离开视口或标签页隐藏时暂停 ----
  let rafId = 0
  let inView = true
  let lastTime = 0
  let firstFrameDone = false

  function frame(time: number) {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0
    lastTime = time

    // 相机缓动环绕(插值系数 0.05,参考 Codrops 的写法)
    orbitX += (pointerX * 0.35 - orbitX) * 0.05
    orbitY += (pointerY * 0.15 - orbitY) * 0.05
    const theta = orbitX
    const phi = 0.12 + orbitY
    camera.position.set(
      Math.sin(theta) * Math.cos(phi) * distance,
      Math.sin(phi) * distance,
      Math.cos(theta) * Math.cos(phi) * distance,
    )
    camera.lookAt(0, 0, 0)

    rock.rotation.y += dt * 0.12
    rock.position.y = lift

    renderer.render(scene, camera)
    if (!firstFrameDone) {
      firstFrameDone = true
      onFirstFrame?.()
    }
    rafId = requestAnimationFrame(frame)
  }

  function start() {
    if (rafId || !inView || document.hidden) return
    lastTime = 0
    rafId = requestAnimationFrame(frame)
  }
  function stop() {
    cancelAnimationFrame(rafId)
    rafId = 0
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (inView) start()
      else stop()
    },
    { threshold: 0 },
  )
  observer.observe(container)
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  start()

  return () => {
    stop()
    observer.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    geo.dispose()
    mat.dispose()
    groundGeo.dispose()
    groundMat.dispose()
    renderer.dispose()
  }
}

/**
 * 首屏原创「分层构造体」场景。
 *
 * 造型由六片不同尺度的倒角层板和一根内核构成，表达工程系统中
 * 「分层、组合、持续迭代」的概念。场景只使用 sage / ink 的同色混合，
 * 不依赖外部模型或纹理，并保持在 Three.js 动态分块内。
 */
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShadowMaterial,
  Sphere,
  SRGBColorSpace,
  WebGLRenderer,
  type Material,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

const SAGE_HEX = 0xc2cabb
const INK_HEX = 0x10120f
const FOV = 32

type LayerSpec = {
  width: number
  depth: number
  x: number
  y: number
  z: number
  rotateY: number
  rotateZ: number
  color: string
  roughness: number
  metalness: number
}

const LAYERS: LayerSpec[] = [
  { width: 3.05, depth: 1.78, x: -0.34, y: -1.05, z: 0.06, rotateY: -0.24, rotateZ: -0.12, color: '#171a15', roughness: 0.62, metalness: 0.14 },
  { width: 3.48, depth: 1.94, x: -0.16, y: -0.63, z: -0.03, rotateY: -0.14, rotateZ: -0.07, color: '#20251d', roughness: 0.48, metalness: 0.18 },
  { width: 3.82, depth: 2.08, x: 0.12, y: -0.21, z: 0.08, rotateY: -0.02, rotateZ: 0.01, color: '#2b3128', roughness: 0.34, metalness: 0.24 },
  { width: 3.7, depth: 2.02, x: 0.28, y: 0.21, z: -0.08, rotateY: 0.13, rotateZ: 0.08, color: '#252b22', roughness: 0.4, metalness: 0.22 },
  { width: 3.34, depth: 1.88, x: 0.12, y: 0.63, z: 0.04, rotateY: 0.27, rotateZ: 0.15, color: '#1c211a', roughness: 0.52, metalness: 0.17 },
  { width: 2.9, depth: 1.68, x: -0.18, y: 1.05, z: -0.02, rotateY: 0.4, rotateZ: 0.22, color: '#30362c', roughness: 0.3, metalness: 0.28 },
]

function framingFor(aspect: number) {
  return aspect >= 1
    ? { px: 0.355, py: 0.49, fill: 0.76 }
    : { px: 0.5, py: 0.33, fill: 0.76 }
}

function createLayerMaterial(spec: LayerSpec) {
  return new MeshPhysicalMaterial({
    color: new Color(spec.color),
    roughness: spec.roughness,
    metalness: spec.metalness,
    clearcoat: 0.34,
    clearcoatRoughness: 0.42,
  })
}

function createSculpture() {
  const sculpture = new Group()
  sculpture.rotation.set(-0.08, -0.34, -0.025)

  LAYERS.forEach((spec) => {
    const geometry = new RoundedBoxGeometry(spec.width, 0.38, spec.depth, 5, 0.055)
    const layer = new Mesh(geometry, createLayerMaterial(spec))
    layer.position.set(spec.x, spec.y, spec.z)
    layer.rotation.set(0.035, spec.rotateY, spec.rotateZ)
    layer.castShadow = true
    layer.receiveShadow = true
    sculpture.add(layer)
  })

  // 内核从层板间隙中若隐若现，让主体不再是一整块没有层次的暗体。
  const coreGeometry = new CylinderGeometry(0.19, 0.24, 2.75, 36)
  const coreMaterial = new MeshPhysicalMaterial({
    color: new Color('#737b6e'),
    roughness: 0.23,
    metalness: 0.58,
    clearcoat: 0.62,
    clearcoatRoughness: 0.18,
  })
  const core = new Mesh(coreGeometry, coreMaterial)
  core.position.set(-0.08, 0, 0.08)
  core.castShadow = true
  sculpture.add(core)

  return sculpture
}

export interface StrataSceneOptions {
  canvas: HTMLCanvasElement
  container: HTMLElement
  onFirstFrame?: () => void
}

export function createStrataScene({ canvas, container, onFirstFrame }: StrataSceneOptions): () => void {
  const scene = new Scene()
  scene.background = new Color(SAGE_HEX)
  scene.fog = new Fog(SAGE_HEX, 15, 42)

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.06
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap

  const sculpture = createSculpture()
  scene.add(sculpture)
  sculpture.updateMatrixWorld(true)

  const bounds = new Box3().setFromObject(sculpture)
  const sphere = bounds.getBoundingSphere(new Sphere())
  const radius = sphere.radius
  const groundY = bounds.min.y - 0.08

  const groundGeometry = new PlaneGeometry(radius * 10, radius * 10)
  const groundMaterial = new ShadowMaterial({ color: INK_HEX, opacity: 0.2 })
  const ground = new Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = groundY
  ground.receiveShadow = true
  scene.add(ground)

  // 柔和环境光建立基础明度，双向轮廓光负责把六层边缘从墨色主体中分离出来。
  scene.add(new HemisphereLight(SAGE_HEX, INK_HEX, 2.1))

  const key = new DirectionalLight(0xffffff, 4.6)
  key.position.set(radius * 2.2, radius * 3.2, radius * 2.8)
  key.castShadow = true
  key.shadow.mapSize.set(1536, 1536)
  const shadowSize = radius * 2.25
  key.shadow.camera.left = -shadowSize
  key.shadow.camera.right = shadowSize
  key.shadow.camera.top = shadowSize
  key.shadow.camera.bottom = -shadowSize
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = radius * 12
  key.shadow.bias = -0.0004
  key.shadow.radius = 7
  scene.add(key)

  const rim = new PointLight(SAGE_HEX, 18, radius * 9, 2)
  rim.position.set(-radius * 2.6, radius * 1.5, -radius * 1.8)
  scene.add(rim)

  const fill = new DirectionalLight(SAGE_HEX, 1.35)
  fill.position.set(-radius * 2, radius * 0.2, radius * 2.6)
  scene.add(fill)

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100)
  const tanHalf = Math.tan((FOV * Math.PI) / 360)
  let distance = 10

  function resize() {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    const aspect = width / height
    const framing = framingFor(aspect)
    renderer.setSize(width, height, false)
    camera.aspect = aspect
    distance = radius / (framing.fill * tanHalf * Math.min(aspect, 1))
    camera.setViewOffset(
      width,
      height,
      (0.5 - framing.px) * width,
      (0.5 - framing.py) * height,
      width,
      height,
    )
    camera.updateProjectionMatrix()
  }
  resize()

  let pointerX = 0
  let pointerY = 0
  let easedX = 0
  let easedY = 0
  let lift = 0

  const onPointerMove = (event: PointerEvent) => {
    pointerX = (event.clientX / window.innerWidth) * 2 - 1
    pointerY = (event.clientY / window.innerHeight) * 2 - 1
  }
  const onScroll = () => {
    lift = Math.min(window.scrollY / window.innerHeight, 1) * radius * 0.18
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', resize)

  let rafId = 0
  let inView = true
  let firstFrameDone = false

  function frame(time: number) {
    easedX += (pointerX - easedX) * 0.035
    easedY += (pointerY - easedY) * 0.035

    camera.position.set(0, radius * 0.11, distance)
    camera.lookAt(0, 0, 0)

    sculpture.rotation.x = -0.08 + easedY * 0.055
    sculpture.rotation.y = -0.34 + easedX * 0.16 + Math.sin(time * 0.00014) * 0.035
    sculpture.rotation.z = -0.025 + easedX * 0.025
    sculpture.position.y = lift + Math.sin(time * 0.00048) * 0.018

    renderer.render(scene, camera)
    if (!firstFrameDone) {
      firstFrameDone = true
      onFirstFrame?.()
    }
    rafId = requestAnimationFrame(frame)
  }

  function start() {
    if (rafId || !inView || document.hidden) return
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
    sculpture.traverse((child) => {
      if (!(child instanceof Mesh)) return
      child.geometry.dispose()
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material: Material) => material.dispose())
    })
    groundGeometry.dispose()
    groundMaterial.dispose()
    renderer.dispose()
  }
}


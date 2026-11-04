/**
 * HeroScene — P4 首屏 Three.js 3D 石头场景
 *
 * 降级策略（满足任一则改用 HeroFallback）：
 *  1. 视口宽度 < 768px
 *  2. prefers-reduced-motion: reduce
 *  3. 不支持 WebGL2
 *  4. navigator.connection?.saveData === true
 *  5. 正在预渲染（window.__PRERENDER_INJECTED）
 *
 * Three.js 通过动态 import() 懒加载，不进入主包。
 */

import { useEffect, useRef, useState } from 'react'
import HeroFallback from '@/components/site/HeroFallback'

// 全局类型扩展
declare global {
  interface Window {
    __PRERENDER_INJECTED?: unknown
  }
  interface Navigator {
    connection?: { saveData?: boolean; effectiveType?: string }
  }
}

interface HeroSceneProps {
  title?: string
  subtitle?: string
}

// ---- 降级检测 ----
function canUseWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

function shouldFallback(): boolean {
  if (typeof window === 'undefined') return true
  if (window.innerWidth < 768) return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (!canUseWebGL2()) return true
  if (navigator.connection?.saveData === true) return true
  if (window.__PRERENDER_INJECTED) return true
  return false
}

// ---- 简单伪噪声：多个 sin/cos 叠加 ----
function pseudoNoise(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.7 + y * 2.3) * 0.5 +
    Math.cos(y * 2.1 - z * 1.9) * 0.3 +
    Math.sin(z * 1.3 + x * 1.1) * 0.2
  )
}

// sage 颜色十六进制值（场景背景/雾，来自 CSS token --sage = #C2CABB）
const SAGE_HEX = 0xc2cabb

export default function HeroScene({
  title = '全栈工程师',
  subtitle = 'AI 工具链 · 独立开发者',
}: HeroSceneProps) {
  const [fallback, setFallback] = useState<boolean | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ---- 首次检测降级 ----
  useEffect(() => {
    setFallback(shouldFallback())
  }, [])

  // ---- Three.js 场景初始化 ----
  useEffect(() => {
    if (fallback !== false) return
    const canvas = canvasRef.current
    if (!canvas) return

    let rafId = 0
    let running = true
    let disposed = false

    // 鼠标目标（归一化 -1~1）
    let mouseTargetX = 0
    let mouseTargetY = 0
    // 相机当前插值位置
    let camX = 0
    let camY = 0
    // 石头因滚动产生的 y 偏移
    let rockScrollY = 0

    // 动态加载 Three.js
    import('three').then((THREE) => {
      if (disposed) return

      // ---- 场景 ----
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(SAGE_HEX)
      scene.fog = new THREE.Fog(SAGE_HEX, 10, 30)

      // ---- 渲染器 ----
      const dpr = Math.min(window.devicePixelRatio, 2)
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setPixelRatio(dpr)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      renderer.setSize(w, h, false)

      // ---- 相机 ----
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
      camera.position.set(0, 1, 8)
      camera.lookAt(0, 0, 0)

      // ---- 光照 ----
      const ambient = new THREE.AmbientLight(SAGE_HEX, 1.2)
      scene.add(ambient)

      const dirLight = new THREE.DirectionalLight(0xffffff, 2.5)
      dirLight.position.set(5, 8, 5)
      dirLight.castShadow = true
      dirLight.shadow.mapSize.width = 1024
      dirLight.shadow.mapSize.height = 1024
      dirLight.shadow.camera.near = 0.5
      dirLight.shadow.camera.far = 30
      dirLight.shadow.camera.left = -6
      dirLight.shadow.camera.right = 6
      dirLight.shadow.camera.top = 6
      dirLight.shadow.camera.bottom = -6
      dirLight.shadow.radius = 8
      scene.add(dirLight)

      // ---- 石头：二十面体细分 4（约 1280 面，远 < 30k 预算）----
      const geo = new THREE.IcosahedronGeometry(2, 4)
      // 噪声位移顶点
      const positions = geo.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = positions.getZ(i)
        const len = Math.sqrt(x * x + y * y + z * z)
        const nx = x / len
        const ny = y / len
        const nz = z / len
        const noise = pseudoNoise(nx * 3, ny * 3, nz * 3)
        const disp = 1 + noise * 0.35
        positions.setXYZ(i, nx * 2 * disp, ny * 2 * disp, nz * 2 * disp)
      }
      geo.computeVertexNormals()

      // 程序纹理：深色 ink + roughness
      const mat = new THREE.MeshStandardMaterial({
        color: 0x10120f, // --ink
        roughness: 0.85,
        metalness: 0.05,
      })

      const rock = new THREE.Mesh(geo, mat)
      rock.castShadow = true
      rock.receiveShadow = false
      rock.position.set(1.5, 0, 0)
      scene.add(rock)

      // ---- 地面 ----
      const groundGeo = new THREE.PlaneGeometry(30, 30)
      const groundMat = new THREE.MeshStandardMaterial({
        color: SAGE_HEX,
        roughness: 1,
        metalness: 0,
      })
      const ground = new THREE.Mesh(groundGeo, groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -2.2
      ground.receiveShadow = true
      scene.add(ground)

      // ---- Resize 处理 ----
      function onResize() {
        if (!canvas) return
        const W = canvas.clientWidth || window.innerWidth
        const H = canvas.clientHeight || window.innerHeight
        renderer.setSize(W, H, false)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      // ---- 鼠标 ----
      function onMouseMove(e: MouseEvent) {
        mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 2
        mouseTargetY = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouseMove)

      // ---- 滚动 ----
      function onScroll() {
        rockScrollY = window.scrollY * 0.003
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      // ---- IntersectionObserver 暂停渲染 ----
      let inViewport = true
      const observer = new IntersectionObserver(
        (entries) => {
          inViewport = entries[0]?.isIntersecting ?? true
        },
        { threshold: 0.01 },
      )
      if (containerRef.current) observer.observe(containerRef.current)

      // ---- visibilitychange 暂停渲染 ----
      function onVisibility() {
        running = !document.hidden
        if (running && inViewport) tick()
      }
      document.addEventListener('visibilitychange', onVisibility)

      // ---- 渲染循环 ----
      let lastTime = 0
      function tick(time = 0) {
        if (disposed) return
        if (!running || !inViewport) return

        const _dt = time - lastTime
        lastTime = time
        void _dt // suppress unused warning

        // 相机缓动插值
        camX += (mouseTargetX * 1.5 - camX) * 0.05
        camY += (mouseTargetY * 0.8 - camY) * 0.05
        camera.position.x = camX
        camera.position.y = 1 + camY - rockScrollY
        camera.lookAt(rock.position)

        // 石头缓慢自转
        rock.rotation.y += 0.003
        rock.rotation.x += 0.001

        renderer.render(scene, camera)
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)

      // ---- Cleanup（存入 effect cleanup 闭包） ----
      ;(canvas as HTMLCanvasElement & { _threeCleanup?: () => void })._threeCleanup = () => {
        disposed = true
        running = false
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('visibilitychange', onVisibility)
        observer.disconnect()
        geo.dispose()
        mat.dispose()
        groundGeo.dispose()
        groundMat.dispose()
        renderer.dispose()
      }
    })

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(rafId)
      const cleanup = (canvas as HTMLCanvasElement & { _threeCleanup?: () => void })._threeCleanup
      if (cleanup) cleanup()
    }
  }, [fallback])

  // 还未完成降级检测时，渲染 Fallback 防闪烁
  if (fallback === null || fallback === true) {
    return <HeroFallback title={title} subtitle={subtitle} />
  }

  // ---- 3D 场景 UI ----
  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '100vh', paddingTop: 'var(--header-h)' }}
    >
      {/* Three.js Canvas 铺满容器 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
        aria-hidden="true"
      />

      {/* 标语层：右对齐，错行，压在物体深色部分之上 */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <div className="site-wrap pb-20">
          <div className="flex flex-col items-end text-right">
            {/* 大装饰行 */}
            <span
              aria-hidden="true"
              className="text-display font-semibold leading-none select-none"
              style={{ color: 'var(--ghost)' }}
            >
              TF49
            </span>

            {/* 主标题 — 墨色，压在石头深色区对比度 11.17:1 */}
            <h1
              className="text-h1 font-semibold leading-tight mt-2 max-w-xs md:max-w-md"
              style={{ color: 'var(--ink)' }}
            >
              {title}
            </h1>

            {/* 副标题 */}
            <p
              className="text-body mt-3"
              style={{ color: 'var(--on-sage-muted)' }}
            >
              {subtitle}
            </p>

            {/* 分隔线装饰 */}
            <div className="mt-8 h-px w-24 bg-line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}

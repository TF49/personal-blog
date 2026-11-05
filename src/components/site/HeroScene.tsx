/**
 * HeroScene — 首屏 Three.js 石头场景
 *
 * 降级策略(满足任一则只显示静态回退图,不请求 three):
 *  1. 视口宽度 < 768px
 *  2. prefers-reduced-motion: reduce
 *  3. 不支持 WebGL2
 *  4. navigator.connection?.saveData === true
 *  5. 正在预渲染(window.__PRERENDER_INJECTED)
 *
 * 场景代码在 hero/rockScene.ts,通过动态 import() 懒加载。
 * 回退图一直垫在画布下面,画布画完第一帧后再淡入,切换时不闪烁。
 */

import { useEffect, useRef, useState } from 'react'
import { HeroFrame } from './HeroFallback'

declare global {
  interface Window {
    __PRERENDER_INJECTED?: unknown
  }
  interface Navigator {
    connection?: { saveData?: boolean; effectiveType?: string }
  }
}

interface HeroSceneProps {
  title: string
  subtitle: string
}

function canUseWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

function shouldFallback(): boolean {
  if (typeof window === 'undefined') return true
  if (window.innerWidth < 768) return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (navigator.connection?.saveData === true) return true
  if (window.__PRERENDER_INJECTED) return true
  if (!canUseWebGL2()) return true
  return false
}

export default function HeroScene({ title, subtitle }: HeroSceneProps) {
  // 只在挂载时判断一次:降级后不会因为窗口变宽而中途加载 3D
  const [use3d] = useState(() => !shouldFallback())
  const [ready, setReady] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!use3d) return
    const canvas = canvasRef.current
    const container = frameRef.current
    if (!canvas || !container) return

    let dispose: (() => void) | undefined
    let cancelled = false
    import('./hero/rockScene')
      .then(({ createRockScene }) => {
        if (cancelled) return
        dispose = createRockScene({ canvas, container, onFirstFrame: () => setReady(true) })
      })
      .catch(() => {
        // 分块加载失败时保留回退图
      })

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [use3d])

  return (
    <HeroFrame ref={frameRef} title={title} subtitle={subtitle}>
      {use3d && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-hero-canvas
          data-ready={ready ? '' : undefined}
          className={`absolute inset-0 block h-full w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </HeroFrame>
  )
}

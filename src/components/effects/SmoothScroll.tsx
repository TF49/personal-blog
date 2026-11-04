import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

/** 取得当前 Lenis 实例;尚未初始化时为 null,调用方需回退到原生滚动 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reducedMotion = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      // 减少动态效果时关闭滚轮平滑,保留原生滚动手感
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    instance.on('scroll', ScrollTrigger.update)

    // Lenis 帧循环挂到 GSAP ticker 上,与 ScrollTrigger 同步
    const tick = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  // 懒加载页面、异步数据会改变页面高度,此时刷新 ScrollTrigger 的位置缓存
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    let timer: number | undefined
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

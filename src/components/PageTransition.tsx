import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, type Location } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/components/effects/SmoothScroll'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

// 淡出 + 淡入合计 300ms(DESIGN.md 第 6 节"路由切换")
const FADE_OUT_S = 0.12
const FADE_IN_S = 0.18

interface PageTransitionProps {
  /** 以"当前展示的 location"渲染路由,淡出完成后才切到新页面 */
  children: (location: Location) => ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const containerRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  // 记录已完成入场处理的路径;用它而非"首次渲染"标记,StrictMode 重复执行副作用时也不会误判
  const shownPath = useRef(location.pathname)

  // 1. 路径变化:先淡出旧页面,再切换展示的 location
  useEffect(() => {
    const el = containerRef.current
    if (location.pathname === displayLocation.pathname) {
      // 仅 search / hash 变化,或淡出途中又回到当前页:不做转场,恢复不透明
      if (location !== displayLocation) setDisplayLocation(location)
      if (el) gsap.set(el, { clearProps: 'opacity' })
      return
    }
    if (!el || prefersReducedMotion()) {
      setDisplayLocation(location)
      return
    }
    gsap.killTweensOf(el)
    const tween = gsap.to(el, {
      opacity: 0,
      duration: FADE_OUT_S,
      ease: 'power1.in',
      onComplete: () => setDisplayLocation(location),
    })
    return () => {
      tween.kill()
    }
  }, [location, displayLocation])

  // 2. 新页面挂载:回到顶部、焦点移到正文、淡入
  useLayoutEffect(() => {
    if (shownPath.current === displayLocation.pathname) return
    shownPath.current = displayLocation.pathname
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)

    document.getElementById('main-content')?.focus({ preventScroll: true })
    ScrollTrigger.refresh()

    const el = containerRef.current
    if (!el) return
    gsap.killTweensOf(el)
    if (prefersReducedMotion()) {
      gsap.set(el, { clearProps: 'opacity' })
      return
    }
    // 不在清理函数里 kill:StrictMode 重放副作用时会被上面的路径守卫跳过,kill 掉会让页面停在透明
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: FADE_IN_S, ease: 'power4.out', clearProps: 'opacity' })
    // 只在展示的页面路径变化时执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayLocation.pathname])

  return (
    <div ref={containerRef} className="w-full">
      {children(displayLocation)}
    </div>
  )
}

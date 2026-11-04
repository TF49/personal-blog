import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface GhostHeadingProps {
  /** 多行标题，每个字符串是一行 */
  lines: string[]
  className?: string
}

/**
 * GhostHeading — 幽灵大标题（装饰性）
 * - aria-hidden="true"
 * - text-display (160px 桌面, 72px 手机)，颜色 --ghost
 * - ScrollTrigger scrub 横向位移（每行方向交错）
 * - reduced-motion 下静态显示
 */
export default function GhostHeading({ lines, className = '' }: GhostHeadingProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (reduced) return
    const triggers: ScrollTrigger[] = []

    lineRefs.current.forEach((el, i) => {
      if (!el) return
      // 奇偶行交替方向，位移 ±60px
      const xFrom = i % 2 === 0 ? -60 : 60
      const xTo = i % 2 === 0 ? 60 : -60

      gsap.set(el, { x: xFrom })

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate(self) {
          gsap.set(el, {
            x: gsap.utils.interpolate(xFrom, xTo, self.progress),
          })
        },
      })
      triggers.push(st)
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [reduced, lines])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`overflow-hidden select-none pointer-events-none ${className}`.trim()}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) lineRefs.current[i] = el
          }}
          className="block text-display font-semibold leading-none whitespace-nowrap"
          style={{ color: 'var(--ghost)' }}
        >
          {line}
        </span>
      ))}
    </div>
  )
}

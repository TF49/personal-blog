import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface RollingDigitsProps {
  value: number
  /** 补零到固定位数,如 pad=3 时 7 显示为 007 */
  pad?: number
  className?: string
  /** 每一位数字列的额外类名(字号、颜色) */
  digitClassName?: string
  /** scrub:随滚动来回滚动;once:进入视口滚动一次(默认) */
  mode?: 'once' | 'scrub'
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * 数字滚轮(装饰性,aria-hidden)。每一位是一列 0–9,进入视口时滚到目标数字。
 * 真实数值需要由调用方另外提供给读屏(sr-only)。
 * reduced-motion 下直接停在目标数字。
 */
export default function RollingDigits({
  value,
  pad = 1,
  className = '',
  digitClassName = '',
  mode = 'once',
}: RollingDigitsProps) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLSpanElement>(null)
  const digits = useMemo(
    () => String(Math.max(0, Math.round(value))).padStart(pad, '0').split('').map(Number),
    [value, pad],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reels = Array.from(root.querySelectorAll<HTMLElement>('[data-reel]'))
    if (reduced) {
      gsap.set(reels, { yPercent: (i: number) => -digits[i] * 10 })
      return
    }

    gsap.set(reels, { yPercent: 0 })
    const tween = gsap.to(reels, {
      yPercent: (i: number) => -digits[i] * 10,
      ease: mode === 'scrub' ? 'none' : 'power3.out',
      duration: mode === 'scrub' ? 1 : 1.4,
      stagger: mode === 'scrub' ? 0 : 0.08,
      scrollTrigger:
        mode === 'scrub'
          ? { trigger: root, start: 'top bottom', end: 'top 25%', scrub: 0.6 }
          : { trigger: root, start: 'top 88%', once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [digits, reduced, mode])

  return (
    <span ref={rootRef} aria-hidden="true" className={`inline-flex select-none leading-none ${className}`.trim()}>
      {digits.map((_, i) => (
        <span key={i} className={`relative inline-block h-[1em] overflow-hidden tabular-nums ${digitClassName}`.trim()}>
          <span data-reel className="flex flex-col will-change-transform">
            {DIGITS.map((d) => (
              <span key={d} className="block h-[1em] leading-none">
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

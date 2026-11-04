import { useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

interface LetterAssemblyProps {
  /** 段落文本，不超过 120 字 */
  text: string
  className?: string
}

/** 将文本拆为字符数组（中文以单汉字为单位） */
function splitChars(text: string): string[] {
  return Array.from(text.slice(0, 120))
}

/** 给飞行字母生成一个随机的初始列（左 or 右） */
function randomSide(): 'left' | 'right' {
  return Math.random() < 0.5 ? 'left' : 'right'
}

/**
 * LetterAssembly — 字母聚拢效果
 * - 目标层：段落，每字是 <span>，初始 opacity 0
 * - 飞行层：aria-hidden，从左右两侧飞向目标位置
 * - ScrollTrigger scrub 驱动
 * - 手机 (< 768px) 或 reduced-motion 下整段淡入
 */
export default function LetterAssembly({ text, className = '' }: LetterAssemblyProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLParagraphElement>(null)
  const flyLayerRef = useRef<HTMLDivElement>(null)
  const chars = useMemo(() => splitChars(text), [text])

  useEffect(() => {
    const container = containerRef.current
    const targetEl = targetRef.current
    const flyLayer = flyLayerRef.current
    if (!container || !targetEl || !flyLayer) return

    const isMobile = window.innerWidth < 768

    if (reduced || isMobile) {
      // 简化：整段淡入
      gsap.set(targetEl, { opacity: 0 })
      const st = ScrollTrigger.create({
        trigger: container,
        start: '50% 100%',
        end: '50% 20%',
        scrub: 1,
        onUpdate(self) {
          gsap.set(targetEl, { opacity: self.progress })
        },
      })
      return () => st.kill()
    }

    // --- 完整动画模式 ---
    const targetSpans = Array.from(targetEl.querySelectorAll<HTMLSpanElement>('span[data-char]'))
    // 初始化目标字符不可见
    gsap.set(targetSpans, { opacity: 0 })

    // 清空飞行层
    flyLayer.innerHTML = ''

    // 获取目标字符位置（相对于 container）
    const containerRect = container.getBoundingClientRect()

    type FlyItem = {
      el: HTMLSpanElement
      targetSpan: HTMLSpanElement
      side: 'left' | 'right'
      index: number
    }
    const flyItems: FlyItem[] = []

    targetSpans.forEach((span, i) => {
      const side = randomSide()
      const flyEl = document.createElement('span')
      flyEl.textContent = span.textContent
      flyEl.setAttribute('aria-hidden', 'true')
      flyEl.style.cssText = `
        position: absolute;
        opacity: 1;
        pointer-events: none;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        line-height: inherit;
        white-space: pre;
      `
      flyLayer.appendChild(flyEl)
      flyItems.push({ el: flyEl, targetSpan: span, side, index: i })
    })

    // 构建主 ScrollTrigger
    const tl = gsap.timeline({ paused: true })

    flyItems.forEach(({ el, targetSpan, side, index }) => {
      const targetRect = targetSpan.getBoundingClientRect()
      const targetX = targetRect.left - containerRect.left
      const targetY = targetRect.top - containerRect.top

      // 起点：左右两侧随机位置
      const startX = side === 'left'
        ? -120 - Math.random() * 80
        : containerRect.width + 60 + Math.random() * 80
      const startY = Math.random() * containerRect.height * 0.8

      // 控制点：纵向 +160px，横向略微偏移
      const ctrlX = targetX + (side === 'left' ? 90 : -90)
      const ctrlY = targetY + 160

      gsap.set(el, { x: startX, y: startY, opacity: 1 })

      const delay = index * 0.025

      // 飞行路径动画（在 timeline 中）
      tl.to(
        el,
        {
          motionPath: {
            path: [
              { x: startX, y: startY },
              { x: ctrlX, y: ctrlY },
              { x: targetX, y: targetY },
            ],
            curviness: 0.85,
          },
          duration: 1,
          ease: 'power2.inOut',
          onUpdate() {
            // 飞行字母接近终点淡出（进度 > 0.65）
            const prog = tl.progress()
            if (prog > 0.65) {
              const fadeOut = (prog - 0.65) / 0.35
              gsap.set(el, { opacity: 1 - fadeOut })
            }
          },
        },
        delay,
      )

      // 目标字符在进度 > 0.65 时淡入
      tl.to(
        targetSpan,
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        },
        delay + 0.65,
      )
    })

    const st = ScrollTrigger.create({
      trigger: container,
      start: '50% 100%',
      end: '50% -10%',
      scrub: 1,
      onUpdate(self) {
        tl.progress(self.progress)
      },
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [reduced, chars])

  return (
    <div ref={containerRef} className={`relative ${className}`.trim()}>
      {/* 飞行层 (aria-hidden) */}
      <div
        ref={flyLayerRef}
        aria-hidden="true"
        className="absolute inset-0 overflow-visible pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* 目标层（真实文本） */}
      <p
        ref={targetRef}
        className="relative text-body-lg text-fg leading-relaxed"
        style={{ zIndex: 2 }}
      >
        {chars.map((char, i) => (
          <span key={i} data-char="true">
            {char}
          </span>
        ))}
      </p>
    </div>
  )
}

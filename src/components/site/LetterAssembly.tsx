import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface LetterAssemblyProps {
  text: string
  className?: string
}

/** 超过这个字数不做逐字动画,整段静态显示(不截断原文) */
const MAX_CHARS = 160
const TEXT_CLASS = 'text-body-lg leading-relaxed'

/** 固定种子的偏移,重建时位置不变。 */
function scatter(seed: number, span: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return ((value - Math.floor(value)) * 2 - 1) * span
}

/** 手机:整段进入视口后一次性淡入，避免逐字动画造成排版抖动。 */
function buildFade(root: HTMLElement, para: HTMLElement): () => void {
  gsap.set(para, { opacity: 0 })
  const tween = gsap.to(para, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: root, start: 'top 88%', once: true },
  })
  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.set(para, { clearProps: 'opacity' })
  }
}

/**
 * 桌面:每个字从段落周围的有限范围聚拢到原位。
 * 只动画最终文本本身，不复制飞行层，因此中途不会出现两套文字叠加；
 * 时间线播放完立即清理内联 transform，保证终态稳定。
 */
function buildAssembly(root: HTMLElement, para: HTMLElement): () => void {
  const items = Array.from(para.querySelectorAll<HTMLSpanElement>('span[data-char]')).filter(
    (span) => (span.textContent ?? '').trim() !== '',
  )
  if (!items.length) return () => {}

  gsap.set(items, {
    display: 'inline-block',
    opacity: 0,
    x: (index: number) => scatter(index + 11, 76),
    y: (index: number) => scatter(index + 71, 46),
    rotation: (index: number) => scatter(index + 131, 8),
  })

  const tween = gsap.to(items, {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    duration: 0.82,
    stagger: { each: 0.004, from: 'center' },
    ease: 'power3.out',
    scrollTrigger: { trigger: root, start: 'top 82%', once: true },
    onComplete: () => gsap.set(items, { clearProps: 'transform,opacity' }),
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.set(items, { clearProps: 'transform,opacity,display' })
  }
}

/**
 * LetterAssembly — 字母聚拢段落
 * - 读屏读 sr-only 的完整原文;动画层与逐字段落都 aria-hidden
 * - 手机(< 768px)整段淡入;reduced-motion 直接显示终态
 */
export default function LetterAssembly({ text, className = '' }: LetterAssemblyProps) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const chars = useMemo(() => Array.from(text), [text])
  const animatable = chars.length <= MAX_CHARS

  useEffect(() => {
    const root = rootRef.current
    const para = paraRef.current
    if (!root || !para || reduced || !animatable) return

    let cleanup: (() => void) | undefined
    let cancelled = false
    let lastWidth = window.innerWidth
    let resizeTimer = 0

    const build = () => {
      cleanup?.()
      cleanup = window.innerWidth < 768 ? buildFade(root, para) : buildAssembly(root, para)
    }

    // 等字体加载完再测量,否则落点会偏
    document.fonts.ready.then(() => {
      if (!cancelled) build()
    })

    // 只有宽度变化才重排(手机地址栏伸缩只改高度)
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      cleanup?.()
    }
  }, [reduced, animatable, chars])

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <p className="sr-only">{text}</p>
      <p ref={paraRef} aria-hidden="true" className={`relative text-fg ${TEXT_CLASS}`}>
        {chars.map((char, i) => (
          <span key={i} data-char="">
            {char}
          </span>
        ))}
      </p>
    </div>
  )
}

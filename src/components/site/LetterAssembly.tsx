import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

interface LetterAssemblyProps {
  text: string
  className?: string
}

/** 超过这个字数不做逐字动画,整段静态显示(不截断原文) */
const MAX_CHARS = 160
/** 起点:段落上方左右各一组字母栅格 */
const COLS_PER_SIDE = 5
const COL_GAP = 22
const ROW_GAP = 30
const GAP_ABOVE = 40
/** 飞行字母在自身进度超过该值后开始和目标字符交叉淡变 */
const CROSSFADE_AT = 0.65

const TEXT_CLASS = 'text-body-lg leading-relaxed'

/** 固定种子的抖动,重建时位置不变 */
function jitter(seed: number): number {
  const v = Math.sin(seed * 12.9898) * 43758.5453
  return (v - Math.floor(v)) * 6 - 3
}

/** 手机:整段随滚动淡入 */
function buildFade(root: HTMLElement, para: HTMLElement): () => void {
  gsap.set(para, { opacity: 0 })
  const tween = gsap.to(para, {
    opacity: 1,
    ease: 'none',
    scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 55%', scrub: 1 },
  })
  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.set(para, { clearProps: 'opacity' })
  }
}

/**
 * 桌面:字母聚拢(参考 Codrops 对 Max Milkin 站的拆解)。
 * 每个字母从段落上方的栅格出发,沿"起点 → 下方控制点 → 终点"的曲线落位;
 * 淡出/淡入按每个字母自己的进度计算,避免中途消失。
 */
function buildAssembly(root: HTMLElement, para: HTMLElement, fly: HTMLElement): () => void {
  const items = Array.from(para.querySelectorAll<HTMLSpanElement>('span[data-char]')).filter(
    (span) => (span.textContent ?? '').trim() !== '',
  )
  if (!items.length) return () => {}

  fly.textContent = ''
  const flyers = items.map((span) => {
    const el = document.createElement('span')
    el.textContent = span.textContent
    el.className = 'absolute left-0 top-0 whitespace-pre'
    fly.appendChild(el)
    return el
  })

  // 测量目标位置(相对 root)。行内 span 的高度是字形区,绝对定位 span 的高度是行高,
  // 字形在行高里垂直居中,所以终点要上移半个差值才能对齐
  const rootRect = root.getBoundingClientRect()
  const flyerH = flyers[0].offsetHeight
  const targets = items.map((span) => {
    const r = span.getBoundingClientRect()
    return {
      x: r.left - rootRect.left,
      y: r.top - rootRect.top - (flyerH - r.height) / 2,
      cx: r.left + r.width / 2 - rootRect.left,
    }
  })

  // 按落点分左右两组,各自排成 COLS_PER_SIDE 列的栅格,放在段落上方
  const width = rootRect.width
  const leftSide = new Set<number>()
  const groups: Record<'left' | 'right', number[]> = { left: [], right: [] }
  targets.forEach((t, k) => {
    const side = t.cx < width / 2 ? 'left' : 'right'
    groups[side].push(k)
    if (side === 'left') leftSide.add(k)
  })
  const starts: { x: number; y: number }[] = new Array(items.length)
  const blockW = (COLS_PER_SIDE - 1) * COL_GAP
  ;(['left', 'right'] as const).forEach((side) => {
    const list = groups[side]
    const rows = Math.ceil(list.length / COLS_PER_SIDE)
    const x0 = side === 'left' ? 0 : width - blockW
    const y0 = -(rows * ROW_GAP) - GAP_ABOVE
    list.forEach((k, n) => {
      starts[k] = {
        x: x0 + (n % COLS_PER_SIDE) * COL_GAP + jitter(k),
        y: y0 + Math.floor(n / COLS_PER_SIDE) * ROW_GAP + jitter(k + 99),
      }
    })
  })

  gsap.set(items, { opacity: 0 })

  // 起点:段落中心到达视口底部;终点:段落中心到达视口 40% 处,读者此时能看到完整段落
  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: '50% 100%', end: '50% 40%', scrub: 1 },
  })

  items.forEach((span, k) => {
    const el = flyers[k]
    const s = starts[k]
    const e = { x: targets[k].x, y: targets[k].y }
    const cp = { x: (s.x + e.x) / 2 + (leftSide.has(k) ? 90 : -90), y: Math.max(s.y, e.y) + 160 }
    gsap.set(el, { x: s.x, y: s.y, opacity: 1 })

    const tween: gsap.core.Tween = gsap.to(el, {
      duration: 1.25,
      ease: 'power2.inOut',
      motionPath: { path: [s, cp, e], curviness: 0.85 },
      onUpdate: () => {
        const p = tween.progress()
        const t = p <= CROSSFADE_AT ? 0 : (p - CROSSFADE_AT) / (1 - CROSSFADE_AT)
        el.style.opacity = String(1 - t)
        span.style.opacity = String(t)
      },
    })
    tl.add(tween, k * 0.025)
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    fly.textContent = ''
    gsap.set(items, { clearProps: 'opacity' })
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
  const flyRef = useRef<HTMLDivElement>(null)
  const chars = useMemo(() => Array.from(text), [text])
  const animatable = chars.length <= MAX_CHARS

  useEffect(() => {
    const root = rootRef.current
    const para = paraRef.current
    const fly = flyRef.current
    if (!root || !para || !fly || reduced || !animatable) return

    let cleanup: (() => void) | undefined
    let cancelled = false
    let lastWidth = window.innerWidth
    let resizeTimer = 0

    const build = () => {
      cleanup?.()
      cleanup = window.innerWidth < 768 ? buildFade(root, para) : buildAssembly(root, para, fly)
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
      <div ref={flyRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${TEXT_CLASS}`} />
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

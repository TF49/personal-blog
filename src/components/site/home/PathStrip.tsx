import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { TimelineEvent } from '@/types'
import SectionLabel from '../SectionLabel'

gsap.registerPlugin(ScrollTrigger)

interface PathStripProps {
  events: TimelineEvent[]
  index: number
}

/**
 * 历程段(sage)。关于页是竖排窄栏时间线,首页改为横向条带避免重复:
 * 一条细线串起各阶段,桌面端随滚动从左向右画出、节点依次点亮;
 * 手机端与 reduced-motion 下为静态竖排列表,内容完整可读。
 */
export default function PathStrip({ events, index }: PathStripProps) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const progress = list.querySelector<HTMLElement>('[data-path-progress]')
      const items = list.querySelectorAll<HTMLElement>('[data-path-item]')
      if (!progress || items.length === 0) return

      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(items, { opacity: 0.28 })

      const steps = Math.max(items.length - 1, 1)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: list, start: 'top 78%', end: 'bottom 60%', scrub: 0.5 },
      })
      tl.to(progress, { scaleX: 1, ease: 'none', duration: steps }, 0)
      items.forEach((item, i) => {
        tl.to(item, { opacity: 1, ease: 'power1.out', duration: 0.35 }, Math.max(i - 0.2, 0))
      })
    })
    return () => mm.revert()
  }, [events])

  return (
    <div className="site-wrap py-24 md:py-32">
      <SectionLabel label="PATH" index={index} />

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] md:items-end">
        <h2 id="path-heading" className="text-h1 font-semibold">
          从课堂到独立开发
        </h2>
        <div>
          <p className="text-body text-fg-muted">
            {events.length} 个阶段，每一段都在缩短「会写代码」和「能交付产品」之间的距离。
          </p>
          <Link
            to="/about"
            className="mt-5 inline-flex min-h-11 items-center border-b border-line text-label text-fg-muted transition-colors hover:text-fg"
          >
            完整经历 →
          </Link>
        </div>
      </div>

      <ol ref={listRef} className="relative mt-16 grid md:mt-24 md:grid-cols-5">
        {/* 轨道线:手机端竖向、桌面端横向;进度线只在桌面端动画 */}
        <span aria-hidden="true" className="absolute bottom-0 left-[4px] top-0 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[4px] md:h-px md:w-auto" />
        <span
          aria-hidden="true"
          data-path-progress=""
          className="absolute hidden bg-fg md:left-0 md:right-0 md:top-[4px] md:block md:h-px"
        />

        {events.map((e, i) => (
          <li
            key={`${e.year}-${i}`}
            data-path-item=""
            className="relative pb-12 pl-8 last:pb-0 md:pb-0 md:pl-0 md:pr-6 md:pt-10"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-1 h-[9px] w-[9px] rounded-full border border-fg bg-sage md:top-0"
            />
            <p className="text-label text-fg-muted">
              <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span aria-hidden="true"> / </span>
              {e.year}
            </p>
            <h3 className="mt-3 text-[clamp(18px,1.45vw,22px)] font-medium leading-snug md:mt-4">{e.title}</h3>
            <p className="mt-3 text-body text-fg-muted">{e.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

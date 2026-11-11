import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import RollingDigits from '../RollingDigits'

gsap.registerPlugin(ScrollTrigger)

interface ManifestoProps {
  /** 主句:逐字随滚动点亮 */
  statement: string
  /** 补充说明:主句点亮后淡入 */
  note: string
}

/** 本地时间(固定东八区),每 30 秒刷新一次 */
function useLocalTime(): string {
  const format = () =>
    new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai',
    }).format(new Date())
  const [time, setTime] = useState(format)
  useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 30_000)
    return () => window.clearInterval(timer)
  }, [])
  return time
}

/**
 * 首屏之后的宣言段(sage)。桌面端用 CSS sticky 钉住一屏,
 * 滚动时主句逐字从 ghost 色点亮到正文色;reduced-motion 下不钉住、直接显示。
 */
export default function Manifesto({ statement, note }: ManifestoProps) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  // 在中文标点之后切分,标点留在前一段末尾
  const phrases = useMemo(() => statement.match(/[^，。；、]+[，。；、]?/g) ?? [statement], [statement])
  const time = useLocalTime()
  const year = new Date().getFullYear()

  useEffect(() => {
    const track = trackRef.current
    const text = textRef.current
    const noteEl = noteRef.current
    if (!track || !text || !noteEl || reduced) return

    const items = text.querySelectorAll<HTMLSpanElement>('span[data-char]')
    gsap.set(items, { opacity: 0.16 })
    gsap.set(noteEl, { opacity: 0, y: 16 })

    const tl = gsap.timeline({
      scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom bottom', scrub: 0.5 },
    })
    tl.to(items, { opacity: 1, ease: 'none', stagger: 0.04, duration: 0.3 })
    tl.to(noteEl, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 }, '>-0.1')

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      gsap.set([...items, noteEl], { clearProps: 'opacity,transform' })
    }
  }, [reduced, phrases])

  return (
    <div
      ref={trackRef}
      className={reduced ? 'relative' : 'relative h-[150svh] md:h-[170svh]'}
      aria-labelledby="manifesto-heading"
      role="region"
    >
      <div className={`${reduced ? '' : 'sticky top-0'} flex h-[100svh] flex-col`}>
        <div className="site-wrap flex items-start justify-between pt-[calc(var(--header-h)+20px)] text-label uppercase">
          <span className="flex items-center gap-1" aria-hidden="true">
            N.
            <RollingDigits value={year} pad={4} mode="scrub" />
          </span>
          <span aria-hidden="true">+</span>
          <span className="flex items-center gap-2 lowercase" aria-hidden="true">
            notes
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-pulse" />
          </span>
        </div>

        <div className="site-wrap flex flex-1 flex-col items-center justify-center text-center">
          <h2 id="manifesto-heading" className="sr-only">
            写作原则
          </h2>
          <p className="sr-only">{statement}</p>
          <p
            ref={textRef}
            aria-hidden="true"
            className="max-w-[16em] text-[clamp(30px,4.2vw,60px)] font-semibold leading-[1.18] text-fg"
          >
            {/* 按标点切成短语,短语内不断行,避免中文在词中间折行 */}
            {phrases.map((phrase, p) => (
              <span key={p} className="inline-block whitespace-nowrap">
                {Array.from(phrase).map((char, i) => (
                  <span key={i} data-char="">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <p ref={noteRef} className="mt-8 max-w-[30em] text-body text-fg-muted md:mt-10">
            {note}
          </p>
        </div>

        <div className="site-wrap flex items-end justify-between pb-8 text-label uppercase text-fg-muted md:pb-10">
          <span>
            四川 · <time>{time}</time>
          </span>
          <span className="lowercase">edition_2.1</span>
        </div>
      </div>
    </div>
  )
}

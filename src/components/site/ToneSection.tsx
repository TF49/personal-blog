import { createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HEADER_PROBE_PX, enterTone, leaveTone, toneClass, type Tone } from './tone'

gsap.registerPlugin(ScrollTrigger)

interface ToneSectionProps extends HTMLAttributes<HTMLElement> {
  tone: Tone
  as?: 'section' | 'footer' | 'header' | 'div' | 'article'
  children?: ReactNode
}

/**
 * 带色调的分区。背景色由自身 class 决定(硬边,无渐变);
 * 同时用 ScrollTrigger 告诉导航栏"现在压在哪种底色上"。
 */
export default function ToneSection({ tone, as = 'section', className = '', children, ...rest }: ToneSectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const id = Symbol('tone-section')
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top ${HEADER_PROBE_PX}px`,
      end: `bottom ${HEADER_PROBE_PX}px`,
      onToggle: (self) => (self.isActive ? enterTone(id, tone) : leaveTone(id)),
    })
    if (trigger.isActive) enterTone(id, tone)
    return () => {
      trigger.kill()
      leaveTone(id)
    }
  }, [tone])

  return createElement(
    as,
    { ref, 'data-tone': tone, className: `${toneClass[tone]} ${className}`.trim(), ...rest },
    children,
  )
}

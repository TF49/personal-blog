import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ScrollHighlightTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  highlightColor?: string
  dimColor?: string
}

export default function ScrollHighlightText({
  text,
  className = '',
  as: Component = 'p',
  highlightColor = '#ffffff',
  dimColor = 'rgba(255, 255, 255, 0.25)',
}: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const words = containerRef.current.querySelectorAll('.scroll-word')
    if (!words.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: dimColor, opacity: 0.3 },
        {
          color: highlightColor,
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 0.8,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [text, highlightColor, dimColor])

  const isEnglish = text.includes(' ')
  const items = isEnglish ? text.split(' ') : text.split('')

  return (
    <Component ref={containerRef as any} className={`leading-relaxed ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          className={`scroll-word inline-block ${isEnglish ? 'mr-[0.25em]' : ''} transition-colors duration-100 will-change-transform`}
          style={{ color: dimColor }}
        >
          {item === ' ' ? '\u00A0' : item}
        </span>
      ))}
    </Component>
  )
}

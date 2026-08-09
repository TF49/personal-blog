import { useState, useRef } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  chars?: string
  speed?: number
  triggerOnHover?: boolean
}

export default function TextScramble({
  text,
  className = '',
  chars = '!<>-_\\/[]{}—=+*^?#________',
  speed = 40,
  triggerOnHover = true,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const isScrambling = useRef(false)

  const scramble = () => {
    if (isScrambling.current) return
    isScrambling.current = true

    let frame = 0
    const totalFrames = text.length * 3
    const queue = text.split('').map((char) => ({
      from: chars[Math.floor(Math.random() * chars.length)],
      to: char,
      start: Math.floor(Math.random() * (totalFrames / 2)),
      end: Math.floor(Math.random() * (totalFrames / 2)) + Math.floor(totalFrames / 2),
      char: '',
    }))

    const interval = setInterval(() => {
      let complete = 0
      let output = ''

      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        if (frame >= item.end) {
          complete++
          output += item.to
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = chars[Math.floor(Math.random() * chars.length)]
          }
          output += `<span class="opacity-70 text-[var(--color-primary)]">${item.char}</span>`
        } else {
          output += item.from
        }
      }

      setDisplayText(output)

      if (complete === queue.length) {
        clearInterval(interval)
        setDisplayText(text)
        isScrambling.current = false
      }
      frame++
    }, speed)
  }

  return (
    <span
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={() => {
        if (triggerOnHover) scramble()
      }}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  )
}

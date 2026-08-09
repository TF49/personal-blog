import React, { useRef } from 'react'

interface ClickSparkProps {
  children: React.ReactNode
  sparkColor?: string
  sparkCount?: number
  className?: string
}

export default function ClickSpark({
  children,
  sparkColor = '#0071e3',
  sparkCount = 10,
  className = '',
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const canvas = document.createElement('canvas')
    canvas.width = rect.width
    canvas.height = rect.height
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '50'
    containerRef.current.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sparks: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
    }> = []

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5
      const speed = Math.random() * 3 + 2
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1.5,
        alpha: 1,
      })
    }

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let active = false

      for (const s of sparks) {
        if (s.alpha > 0) {
          active = true
          s.x += s.vx
          s.y += s.vy
          s.alpha -= 0.04
          s.vy += 0.08 // gravity

          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
          ctx.fillStyle = sparkColor
          ctx.globalAlpha = Math.max(0, s.alpha)
          ctx.fill()
        }
      }

      frame++
      if (active && frame < 40) {
        requestAnimationFrame(animate)
      } else {
        canvas.remove()
      }
    }

    animate()
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block ${className}`}
    >
      {children}
    </div>
  )
}

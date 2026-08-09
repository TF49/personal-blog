import { useEffect, useRef } from 'react'

interface ParticlesProps {
  className?: string
  particleCount?: number
  particleColor?: string
  lineColor?: string
  maxDistance?: number
}

export default function Particles({
  className = '',
  particleCount = 50,
  particleColor = 'rgba(255, 255, 255, 0.4)',
  lineColor = 'rgba(0, 113, 227, 0.15)',
  maxDistance = 120,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const mouse = { x: -1000, y: -1000 }

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 1,
      })
    }

    const handleResize = () => {
      if (!canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Mouse attraction / slight push
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 150) {
          p.x += (dx / dist) * 0.4
          p.y += (dy / dist) * 0.4
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distP = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (distP < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = (1 - distP / maxDistance) * 0.8
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, particleColor, lineColor, maxDistance])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto z-0 ${className}`}
    />
  )
}

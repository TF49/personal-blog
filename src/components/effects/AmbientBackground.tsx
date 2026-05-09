import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

const ROUTE_DENSITY: Record<string, number> = {
  '/': 52,
  '/blog': 34,
  '/about': 28,
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const location = useLocation()
  const density = useMemo(() => ROUTE_DENSITY[location.pathname] ?? 30, [location.pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const particles: Particle[] = []
    let animationFrame = 0
    let width = 0
    let height = 0
    let dpr = 1

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.55 + 0.12,
    })

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      particles.length = 0
      for (let i = 0; i < density; i += 1) {
        particles.push(createParticle())
      }
    }

    const drawGradient = () => {
      const gradient = context.createRadialGradient(
        width * 0.22,
        height * 0.18,
        40,
        width * 0.22,
        height * 0.18,
        width * 0.65,
      )
      gradient.addColorStop(0, 'rgba(246, 181, 0, 0.16)')
      gradient.addColorStop(0.4, 'rgba(246, 181, 0, 0.06)')
      gradient.addColorStop(1, 'rgba(246, 181, 0, 0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      const sideGlow = context.createRadialGradient(
        width * 0.85,
        height * 0.75,
        20,
        width * 0.85,
        height * 0.75,
        width * 0.5,
      )
      sideGlow.addColorStop(0, 'rgba(230, 0, 18, 0.14)')
      sideGlow.addColorStop(1, 'rgba(230, 0, 18, 0)')
      context.fillStyle = sideGlow
      context.fillRect(0, 0, width, height)
    }

    const render = () => {
      context.clearRect(0, 0, width, height)
      drawGradient()

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i]
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`
        context.fill()

        for (let j = i + 1; j < particles.length; j += 1) {
          const neighbor = particles[j]
          const dx = particle.x - neighbor.x
          const dy = particle.y - neighbor.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 140) {
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(neighbor.x, neighbor.y)
            context.strokeStyle = `rgba(246, 181, 0, ${0.08 * (1 - distance / 140)})`
            context.lineWidth = 0.8
            context.stroke()
          }
        }
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    resize()
    render()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [density])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
    </div>
  )
}

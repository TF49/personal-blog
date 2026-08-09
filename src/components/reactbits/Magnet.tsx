import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface MagnetProps {
  children: React.ReactNode
  className?: string
  strength?: number
  range?: number
  disabled?: boolean
}

export default function Magnet({
  children,
  className = '',
  strength = 0.25,
  range = 100,
  disabled = false,
}: MagnetProps) {
  const magnetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled || !magnetRef.current) return

    const el = magnetRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.hypot(distX, distY)

      if (distance < range) {
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.4,
          ease: 'power2.out',
        })
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, range, disabled])

  return (
    <div ref={magnetRef} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}

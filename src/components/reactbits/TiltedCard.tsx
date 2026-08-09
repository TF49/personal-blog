import React, { useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface TiltedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  maxRotation?: number
  scaleOnHover?: number
  glareOpacity?: number
}

export default function TiltedCard({
  children,
  className = '',
  maxRotation = 12,
  scaleOnHover = 1.03,
  glareOpacity = 0.15,
  ...props
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useSpring(0, { stiffness: 300, damping: 20 })
  const y = useSpring(0, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(y, [-0.5, 0.5], [maxRotation, -maxRotation])
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxRotation, maxRotation])

  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative cursor-pointer ${className}`}
      {...props}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{
          scale: { duration: 0.25, ease: 'easeOut' },
        }}
        className="relative w-full h-full rounded-2xl border border-white/10 bg-[#161617]/80 overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 w-full h-full">
          {children}
        </div>

        {/* Glare effect */}
        {isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, ${glareOpacity}), transparent 60%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  )
}

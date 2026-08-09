import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface CircularTextProps {
  text: string
  radius?: number
  className?: string
  spinDuration?: number
  centerIcon?: React.ReactNode
}

export default function CircularText({
  text,
  radius = 60,
  className = '',
  spinDuration = 20,
  centerIcon,
}: CircularTextProps) {
  const characters = useMemo(() => text.split(''), [text])
  const degreeStep = 360 / characters.length

  return (
    <div
      className={`relative flex items-center justify-center select-none group ${className}`}
      style={{ width: radius * 2 + 30, height: radius * 2 + 30 }}
    >
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: spinDuration,
          ease: 'linear',
        }}
        whileHover={{ scale: 1.08 }}
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
      >
        {characters.map((char, index) => {
          const rotate = index * degreeStep
          return (
            <span
              key={index}
              className="absolute font-mono text-[10px] uppercase font-bold tracking-widest text-white/60 group-hover:text-[var(--color-primary)] transition-colors duration-300"
              style={{
                transform: `rotate(${rotate}deg) translateY(-${radius}px)`,
                transformOrigin: 'center center',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </motion.div>

      {/* Center Icon or Pulse Dot */}
      <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg group-hover:border-[var(--color-primary)]/40 transition-colors duration-300">
        {centerIcon ? (
          centerIcon
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_10px_var(--color-primary)]" />
        )}
      </div>
    </div>
  )
}

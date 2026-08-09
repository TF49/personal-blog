import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  type?: 'chars' | 'words'
  animation?: 'fadeUp' | 'popIn' | 'blurIn'
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  type = 'chars',
  animation = 'fadeUp',
}: SplitTextProps) {
  const units = useMemo(() => {
    if (type === 'chars') {
      return text.split('')
    }
    return text.split(' ')
  }, [text, type])

  const getVariants = (idx: number) => {
    const itemDelay = delay + idx * stagger
    if (animation === 'popIn') {
      return {
        initial: { opacity: 0, scale: 0.5, y: 15 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.4, delay: itemDelay, ease: [0.34, 1.56, 0.64, 1] as any },
      }
    }
    if (animation === 'blurIn') {
      return {
        initial: { opacity: 0, filter: 'blur(10px)', y: 12 },
        animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
        transition: { duration: 0.5, delay: itemDelay, ease: 'easeOut' as any },
      }
    }
    // Default fadeUp
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: itemDelay, ease: [0.25, 1, 0.5, 1] as any },
    }
  }

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {units.map((unit, i) => {
        const v = getVariants(i)
        return (
          <motion.span
            key={i}
            initial={v.initial}
            animate={v.animate}
            transition={v.transition}
            style={{ display: 'inline-block', whiteSpace: type === 'chars' && unit === ' ' ? 'pre' : 'normal' }}
          >
            {unit === ' ' ? '\u00A0' : unit}
            {type === 'words' && i < units.length - 1 ? '\u00A0' : ''}
          </motion.span>
        )
      })}
    </span>
  )
}

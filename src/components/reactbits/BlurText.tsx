import { motion } from 'framer-motion'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
}

export default function BlurText({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  animateBy = 'words',
  direction = 'bottom',
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{
            filter: 'blur(12px)',
            opacity: 0,
            y: direction === 'bottom' ? 24 : -24,
          }}
          animate={{
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration,
            delay: delay + i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: 'inline-block',
            whiteSpace: animateBy === 'letters' && el === ' ' ? 'pre' : 'normal',
          }}
        >
          {el === ' ' ? '\u00A0' : el}
          {animateBy === 'words' && i < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

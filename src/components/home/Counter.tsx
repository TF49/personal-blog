import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

export default function Counter({ value, unit }: { value: string; unit: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return (
    <div ref={ref} className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl text-[var(--color-primary)] leading-none tracking-tighter">
      {value.startsWith('+') ? '+' : ''}{count}{unit}
    </div>
  )
}

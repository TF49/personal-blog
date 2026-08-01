import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Page entrance animation
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power3.out',
          clearProps: 'all'
        }
      )
    }

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current)
      }
    }
  }, [location.pathname])

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  )
}

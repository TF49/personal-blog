import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // GSAP smooth follow for trail
      if (trailRef.current) {
        gsap.to(trailRef.current, {
          x: e.clientX - 20,
          y: e.clientY - 20,
          duration: 0.5,
          ease: 'power2.out'
        })
      }
    }
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, a, .cursor-pointer, .btn-primary, .btn-outline')) {
        setIsHovering(true)
        // Magnetic effect on hover
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            scale: 2.5,
            duration: 0.3,
            ease: 'back.out(1.7)'
          })
        }
      } else {
        setIsHovering(false)
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      }
    }
    
    const handleMouseDown = () => {
      setIsClicking(true)
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 0.8,
          duration: 0.1,
          ease: 'power2.in'
        })
      }
    }
    
    const handleMouseUp = () => {
      setIsClicking(false)
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: isHovering ? 2.5 : 1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isHovering])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-[var(--color-primary)] pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200,
          mass: 0.5
        }}
        style={{
          backgroundColor: isClicking ? 'rgba(246, 181, 0, 0.3)' : 'transparent',
          borderColor: isHovering ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.5)'
        }}
      />
      
      {/* Trail cursor */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 pointer-events-none z-[9998] hidden md:block blur-sm"
        style={{
          transform: 'translate(-20px, -20px)'
        }}
      />
      
      {/* Click burst effect */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 w-16 h-16 rounded-full border border-[var(--color-primary)] pointer-events-none z-[9997] hidden md:block"
          initial={{ x: position.x - 32, y: position.y - 32, scale: 0.5, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        />
      )}
    </>
  )
}
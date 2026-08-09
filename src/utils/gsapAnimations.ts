import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

// Apple-style easing functions - smooth, elegant, never rushed
export const appleEasing = {
  // Smooth entrance
  entrance: 'power3.out',
  // Elegant exit
  exit: 'power2.in',
  // Natural movement
  natural: 'power2.inOut',
  // Subtle hover
  hover: 'power1.out',
  // Premium reveal
  reveal: 'expo.out',
  // Cinematic slow
  cinematic: 'sine.inOut',
}

// Apple-style animation configurations
export const appleConfig = {
  // Hero section entrance
  heroEntrance: {
    duration: 1.2,
    ease: appleEasing.entrance,
    stagger: 0.15,
  },
  
  // Scroll-triggered reveals
  scrollReveal: {
    duration: 0.8,
    ease: appleEasing.reveal,
    stagger: 0.1,
  },
  
  // Text animations
  textReveal: {
    duration: 0.6,
    ease: appleEasing.entrance,
    stagger: 0.03,
  },
  
  // Card hover effects
  cardHover: {
    duration: 0.4,
    ease: appleEasing.hover,
  },
  
  // Page transitions
  pageTransition: {
    duration: 0.5,
    ease: appleEasing.natural,
  },
}

// Awwwards experimental easing - bold, dynamic, physics-based
export const experimentalEasing = {
  // Bold entrance
  entrance: 'expo.out',
  // Dramatic exit
  exit: 'power4.in',
  // Elastic bounce
  elastic: 'elastic.out(1, 0.5)',
  // Smooth scroll
  scroll: 'power2.inOut',
  // Sharp transition
  sharp: 'power4.inOut',
  // Natural drift
  drift: 'sine.inOut',
  // Aggressive reveal
  reveal: 'back.out(1.7)',
}

// Experimental animation configurations - MOTION_INTENSITY: 8
export const experimentalConfig = {
  // Hero section - cinematic entrance
  heroEntrance: {
    duration: 1.8,
    ease: experimentalEasing.entrance,
    stagger: 0.08,
  },
  
  // Scroll-triggered physics
  scrollPhysics: {
    duration: 1,
    ease: experimentalEasing.scroll,
    scrub: 1.5,
  },
  
  // Kinetic text animations
  kineticText: {
    duration: 0.4,
    ease: experimentalEasing.sharp,
    stagger: 0.02,
  },
  
  // Magnetic hover effects
  magneticHover: {
    duration: 0.6,
    ease: experimentalEasing.elastic,
  },
  
  // Page transitions
  pageTransition: {
    duration: 0.8,
    ease: experimentalEasing.exit,
  },
  
  // Parallax depth
  parallaxDepth: {
    speed: 0.3,
    scrub: 2,
  },
}

/**
 * Kinetic text animation - character by character reveal with Apple-style smooth timing
 */
export function animateKineticText(
  element: Element,
  options?: {
    type?: 'chars' | 'words'
    from?: { opacity?: number; y?: number; rotation?: number }
    to?: { opacity?: number; y?: number; rotation?: number }
    duration?: number
    delay?: number
    stagger?: number
  }
) {
  const defaults = {
    type: 'chars',
    from: { opacity: 0, y: 30, rotation: 0 },
    to: { opacity: 1, y: 0, rotation: 0 },
    duration: appleConfig.textReveal.duration,
    delay: 0,
    stagger: appleConfig.textReveal.stagger,
  }
  
  const config = { ...defaults, ...options }
  
  // Split text based on type
  let targets: Element[]
  if (config.type === 'chars') {
    const chars = element.textContent?.split('') || []
    element.innerHTML = chars.map(char => 
      `<span style="display: inline-block; white-space: pre; transform-origin: center bottom;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')
    targets = Array.from(element.querySelectorAll('span'))
  } else {
    const words = element.textContent?.split(/\s+/) || []
    element.innerHTML = words.map(word => 
      `<span style="display: inline-block; white-space: nowrap;">${word}</span>`
    ).join(' ')
    targets = Array.from(element.querySelectorAll('span'))
  }
  
  return gsap.fromTo(targets, config.from, {
    ...config.to,
    duration: config.duration,
    delay: config.delay,
    stagger: config.stagger,
    ease: appleEasing.entrance,
  })
}

/**
 * Scroll-driven parallax with depth layers
 */
export function animateParallaxDepth(
  element: string | Element,
  options?: {
    speed?: number
    rotation?: number
    start?: string
    end?: string
    scrub?: boolean | number
  }
) {
  const defaults = {
    speed: 0.2,
    rotation: 0,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.to(element, {
    y: () => -ScrollTrigger.maxScroll(window) * config.speed,
    rotation: config.rotation,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
    },
  })
}

/**
 * Magnetic button effect - follows cursor with smooth Apple easing (no bounce)
 */
export function animateMagneticButton(
  element: HTMLElement,
  options?: {
    strength?: number
    returnDuration?: number
  }
) {
  const defaults = {
    strength: 0.2,
    returnDuration: 0.6,
  }
  
  const config = { ...defaults, ...options }
  
  const moveButton = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * config.strength
    const deltaY = (e.clientY - centerY) * config.strength
    
    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: appleEasing.hover,
    })
  }
  
  const resetButton = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: config.returnDuration,
      ease: appleEasing.entrance,
    })
  }
  
  element.addEventListener('mousemove', moveButton)
  element.addEventListener('mouseleave', resetButton)
  
  return () => {
    element.removeEventListener('mousemove', moveButton)
    element.removeEventListener('mouseleave', resetButton)
  }
}

/**
 * Horizontal scroll section
 */
export function animateHorizontalScroll(
  container: HTMLElement,
  sections: HTMLElement[],
  options?: {
    speed?: number
    scrub?: boolean | number
  }
) {
  const defaults = {
    speed: 1,
    scrub: 1,
  }
  
  const config = { ...defaults, ...options }
  
  const totalWidth = sections.reduce((acc, section) => acc + section.offsetWidth, 0)
  
  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: config.scrub,
      end: () => `+=${totalWidth}`,
    },
  })
}

/**
 * Staggered grid reveal with wave effect
 */
export function animateGridWave(
  elements: NodeListOf<Element> | Element[],
  options?: {
    from?: { opacity?: number; scale?: number; y?: number }
    to?: { opacity?: number; scale?: number; y?: number }
    duration?: number
    stagger?: number | { grid?: [number, number]; from?: "start" | "center" | "end" | "edges" | "random" | number | [number, number]; amount?: number }
  }
) {
  const defaults: {
    from: { opacity: number; scale: number; y: number }
    to: { opacity: number; scale: number; y: number }
    duration: number
    stagger: number | { grid?: [number, number]; from?: "start" | "center" | "end" | "edges" | "random" | number | [number, number]; amount?: number }
  } = {
    from: { opacity: 0, scale: 0.8, y: 30 },
    to: { opacity: 1, scale: 1, y: 0 },
    duration: 0.6,
    stagger: {
      grid: [3, 3],
      from: 'center',
      amount: 0.5,
    },
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.fromTo(elements, config.from, {
    ...config.to,
    duration: config.duration,
    stagger: config.stagger,
    ease: experimentalEasing.reveal,
  })
}

/**
 * Text scramble effect - experimental cyberpunk style
 */
export function animateTextScramble(
  element: Element,
  finalText: string,
  options?: {
    duration?: number
    chars?: string
  }
) {
  const defaults = {
    duration: 0.5,
    chars: '!<>-_\\/[]{}—=+*^?#________',
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.to(element, {
    duration: config.duration,
    text: {
      value: finalText,
      delimiter: '',
    },
    onUpdate: function(this: gsap.core.Tween) {
      const progress = this.progress()
      const scrambled = finalText
        .split('')
        .map((_, i) => {
          if (i < progress * finalText.length) {
            return finalText[i]
          }
          return config.chars[Math.floor(Math.random() * config.chars.length)]
        })
        .join('')
      element.textContent = scrambled
    },
    ease: experimentalEasing.sharp,
  })
}

/**
 * Number counter animation
 */
export function animateNumberCounter(
  element: Element,
  endValue: number,
  options?: {
    duration?: number
    startValue?: number
    prefix?: string
    suffix?: string
    decimals?: number
    delay?: number
  }
) {
  const defaults = {
    duration: 2,
    startValue: 0,
    prefix: '',
    suffix: '',
    decimals: 0,
    delay: 0,
  }
  
  const config = { ...defaults, ...options }
  
  const obj = { value: config.startValue }
  
  return gsap.to(obj, {
    value: endValue,
    duration: config.duration,
    delay: config.delay,
    ease: appleEasing.reveal,
    onUpdate: () => {
      const formatted = config.decimals > 0 
        ? obj.value.toFixed(config.decimals)
        : Math.floor(obj.value).toString()
      element.textContent = `${config.prefix}${formatted}${config.suffix}`
    },
  })
}

/**
 * Stagger children animation
 */
export function animateStagger(
  parent: string | Element,
  selector: string,
  options?: {
    from?: { opacity?: number; y?: number; x?: number }
    to?: { opacity?: number; y?: number; x?: number }
    duration?: number
    stagger?: number
  }
) {
  const defaults = {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    duration: appleConfig.scrollReveal.duration,
    stagger: 0.1,
  }
  
  const config = { ...defaults, ...options }
  const children = typeof parent === 'string' 
    ? document.querySelector(parent)?.querySelectorAll(selector)
    : (parent as Element).querySelectorAll(selector)
  
  if (!children || children.length === 0) return
  
  return gsap.fromTo(children, config.from, {
    ...config.to,
    duration: config.duration,
    stagger: config.stagger,
    ease: appleEasing.entrance,
  })
}

/**
 * Clean up all ScrollTrigger instances
 */
export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

/**
 * Refresh ScrollTrigger after layout changes
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

/**
 * Animate elements with Apple-style entrance
 */
export function animateEntrance(
  elements: string | Element | NodeListOf<Element>,
  options?: {
    from?: { opacity?: number; y?: number; x?: number; scale?: number }
    to?: { opacity?: number; y?: number; x?: number; scale?: number }
    duration?: number
    delay?: number
    stagger?: number
  }
) {
  const defaults = {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    duration: appleConfig.heroEntrance.duration,
    delay: 0,
    stagger: appleConfig.heroEntrance.stagger,
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.fromTo(elements, config.from, {
    ...config.to,
    duration: config.duration,
    delay: config.delay,
    stagger: config.stagger,
    ease: appleEasing.entrance,
  })
}

/**
 * Scroll-triggered reveal animation
 */
export function animateScrollReveal(
  elements: string | Element | NodeListOf<Element>,
  options?: {
    from?: { opacity?: number; y?: number; x?: number; scale?: number }
    to?: { opacity?: number; y?: number; x?: number; scale?: number }
    start?: string
    end?: string
    scrub?: boolean | number
  }
) {
  const defaults = {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
    start: 'top 85%',
    end: 'top 65%',
    scrub: false,
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.fromTo(elements, config.from, {
    ...config.to,
    duration: appleConfig.scrollReveal.duration,
    ease: appleEasing.reveal,
    scrollTrigger: {
      trigger: elements,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
    },
  })
}

/**
 * Text reveal animation - character by character or word by word
 */
export function animateTextReveal(
  element: Element,
  options?: {
    type?: 'chars' | 'words' | 'lines'
    from?: { opacity?: number; y?: number }
    to?: { opacity?: number; y?: number }
    duration?: number
    delay?: number
  }
) {
  const defaults = {
    type: 'words',
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    duration: appleConfig.textReveal.duration,
    delay: 0,
  }
  
  const config = { ...defaults, ...options }
  
  // Split text based on type
  let targets: Element[]
  if (config.type === 'chars') {
    const chars = element.textContent?.split('') || []
    element.innerHTML = chars.map(char => 
      `<span style="display: inline-block; white-space: pre;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')
    targets = Array.from(element.querySelectorAll('span'))
  } else if (config.type === 'words') {
    const words = element.textContent?.split(/\s+/) || []
    element.innerHTML = words.map(word => 
      `<span style="display: inline-block; white-space: nowrap;">${word}</span>`
    ).join(' ')
    targets = Array.from(element.querySelectorAll('span'))
  } else {
    // Lines - requires more complex handling
    targets = [element]
  }
  
  return gsap.fromTo(targets, config.from, {
    ...config.to,
    duration: config.duration,
    delay: config.delay,
    stagger: appleConfig.textReveal.stagger,
    ease: appleEasing.entrance,
  })
}

/**
 * Parallax effect on scroll
 */
export function animateParallax(
  element: string | Element,
  options?: {
    speed?: number
    start?: string
    end?: string
    scrub?: boolean | number
  }
) {
  const defaults = {
    speed: 0.5,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.to(element, {
    y: -ScrollTrigger.maxScroll(window) * config.speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
    },
  })
}

/**
 * Scale and fade on scroll
 */
export function animateScaleFade(
  elements: string | Element | NodeListOf<Element>,
  options?: {
    from?: { opacity?: number; scale?: number; x?: number; y?: number }
    to?: { opacity?: number; scale?: number; x?: number; y?: number }
    start?: string
    end?: string
    scrollTrigger?: boolean
    delay?: number
    duration?: number
  }
) {
  const defaults = {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    start: 'top 80%',
    end: 'top 60%',
    scrollTrigger: true,
    delay: 0,
    duration: appleConfig.scrollReveal.duration,
  }
  
  const config = { ...defaults, ...options }
  
  const animationConfig: any = {
    ...config.to,
    duration: config.duration,
    delay: config.delay,
    ease: appleEasing.reveal,
  }
  
  if (config.scrollTrigger) {
    animationConfig.scrollTrigger = {
      trigger: elements,
      start: config.start,
      end: config.end,
    }
  }
  
  return gsap.fromTo(elements, config.from, animationConfig)
}

/**
 * Counter animation for numbers (alias for backward compatibility)
 */
export const animateCounter = animateNumberCounter

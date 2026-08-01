import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
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
 * Counter animation for numbers
 */
export function animateCounter(
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
  
  if (!children) return
  
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

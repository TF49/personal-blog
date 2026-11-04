import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

interface IntroLoaderProps {
  onDone: () => void
}

const SESSION_KEY = 'tf49:intro-seen'

const WORDS = ['涂家乐', 'TF49', 'BLOG', 'NOTES', 'CODE', 'WRITING'] as const
const RING_COUNT = WORDS.length

/** 单圈配置 */
function getRingConfig(i: number) {
  return {
    radius: 80 + i * 18,
    speed: 0.0002 + i * 0.0003,
    offset: i * 0.4,
  }
}

/**
 * IntroLoader — Canvas 2D 字母环加载页
 * - 每会话一次 (sessionStorage)
 * - 可跳过 (click / Enter / Esc)
 * - prefers-reduced-motion 或 __PRERENDER_INJECTED 时直接跳过
 * - aria-hidden="true"，不阻塞 DOM 内容
 */
export default function IntroLoader({ onDone }: IntroLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const doneRef = useRef(false)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const alphaRef = useRef<number[]>(Array(RING_COUNT).fill(0))
  const countRef = useRef(0)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    cancelAnimationFrame(rafRef.current)
    tlRef.current?.kill()
    sessionStorage.setItem(SESSION_KEY, '1')
    onDone()
  }, [onDone])

  useEffect(() => {
    // 1. 每会话一次检查
    if (sessionStorage.getItem(SESSION_KEY)) {
      onDone()
      return
    }

    // 2. prefers-reduced-motion 或 prerender 时跳过
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // @ts-expect-error – injected by prerender tooling
    const isPrerender = typeof __PRERENDER_INJECTED !== 'undefined'
    if (prefersReduced || isPrerender) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onDone()
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 3. 读取 CSS 令牌颜色（在 :root 上）
    const rootStyles = getComputedStyle(document.documentElement)
    const sageBg = rootStyles.getPropertyValue('--sage').trim() || '#C2CABB'
    const inkColor = rootStyles.getPropertyValue('--ink').trim() || '#10120F'

    // 4. 画布尺寸
    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 5. GSAP 时间线控制 alpha 和计数
    const proxy = {
      count: 0,
      ring0: 0, ring1: 0, ring2: 0, ring3: 0, ring4: 0, ring5: 0,
    }
    const tl = gsap.timeline({ onComplete: finish })
    tlRef.current = tl

    // 淡入各圈 (stagger 0.12s)
    for (let i = 0; i < RING_COUNT; i++) {
      tl.to(proxy, {
        [`ring${i}`]: 1,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate() {
          alphaRef.current[i] = (proxy as Record<string, number>)[`ring${i}`]
        },
      }, i * 0.12)
    }

    // 计数 0→100 (1.4s, 线性)，紧跟最后一个圈淡入
    const countStart = (RING_COUNT - 1) * 0.12 + 0.4
    tl.to(proxy, {
      count: 100,
      duration: 1.4,
      ease: 'none',
      onUpdate() {
        countRef.current = Math.round(proxy.count)
      },
    }, countStart)

    // 淡出各圈 (stagger 0.08s, 0.8s)
    const fadeOutStart = countStart + 1.4
    for (let i = 0; i < RING_COUNT; i++) {
      tl.to(proxy, {
        [`ring${i}`]: 0,
        duration: 0.5,
        ease: 'power2.in',
        onUpdate() {
          alphaRef.current[i] = (proxy as Record<string, number>)[`ring${i}`]
        },
      }, fadeOutStart + i * 0.08)
    }

    // 6. Canvas 渲染循环
    startTimeRef.current = performance.now()
    function draw(now: number) {
      if (!ctx || !canvas) return
      const t = (now - startTimeRef.current) / 1000

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 背景
      ctx.fillStyle = sageBg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // 计数文字
      if (countRef.current > 0) {
        const maxAlpha = Math.max(...alphaRef.current)
        ctx.save()
        ctx.globalAlpha = maxAlpha
        ctx.fillStyle = inkColor
        ctx.font = `600 48px "Inter Tight Variable", system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${countRef.current}`, cx, cy)
        ctx.restore()
      }

      // 各圈字母
      for (let i = 0; i < RING_COUNT; i++) {
        const alpha = alphaRef.current[i]
        if (alpha <= 0) continue

        const { radius, speed, offset } = getRingConfig(i)
        const word = WORDS[i]
        const chars = Array.from(word)

        // 旋转角 (随时间推进)
        const baseAngle = t * speed * 1000 * (2 * Math.PI)

        // 呼吸弧长 extent = π + sin(t − offset) × 0.5
        const extent = Math.PI + Math.sin(t - offset) * 0.5

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = inkColor
        ctx.font = `600 16px "Inter Tight Variable", system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const totalChars = chars.length
        for (let c = 0; c < totalChars; c++) {
          const angle = baseAngle + (c / totalChars) * extent
          const x = cx + Math.cos(angle) * radius
          const y = cy + Math.sin(angle) * radius

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(angle + Math.PI / 2)
          ctx.fillText(chars[c], 0, 0)
          ctx.restore()
        }

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    // 7. 跳过事件
    const skip = () => {
      tl.progress(1)
      finish()
    }
    canvas.addEventListener('click', skip)
    const keySkip = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') skip()
    }
    window.addEventListener('keydown', keySkip)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', skip)
      window.removeEventListener('keydown', keySkip)
      cancelAnimationFrame(rafRef.current)
      tl.kill()
    }
  }, [onDone, finish])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'block',
        cursor: 'pointer',
      }}
    />
  )
}

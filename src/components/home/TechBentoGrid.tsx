import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Layout, Database, Share2, Zap } from 'lucide-react'
import { gsap } from 'gsap'
import { SpotlightCard, BlurText, ShinyText, TiltedCard } from '@/components/reactbits'

interface ProgressBarProps {
  level: number
  delay?: number
}

function ProgressBar({ level, delay = 0 }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let animationFrameId: number
    let startTimestamp: number | null = null
    const duration = 1200

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        
        // Fluid cubic ease out curve
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.round(easeProgress * level))

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step)
        }
      }
      animationFrameId = requestAnimationFrame(step)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, level, delay])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-normal tracking-wide text-white/40">
        <span>MASTERY</span>
        <span className="text-white/70 font-mono transition-colors">{displayValue}%</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 1.2,
            delay: delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[#af52de] relative rounded-full shadow-[0_0_8px_rgba(0,113,227,0.5)]"
        >
          {/* Leading edge glow effect */}
          <div className="absolute top-0 right-0 h-full w-2 bg-white/80 blur-[1px] rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}

export default function TechBentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !itemsRef.current) return

    const ctx = gsap.context(() => {
      const bentoItems = itemsRef.current?.querySelectorAll('.bento-item')
      bentoItems?.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, scale: 0.9, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              end: 'top 65%',
              scrub: true,
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const items = [
    { title: '全栈架构', subtitle: 'React & Spring Boot', level: 95, icon: <Layout className="w-6 h-6 text-[#0071e3]" />, className: 'md:col-span-2 md:row-span-2', glow: 'rgba(0, 113, 227, 0.25)' },
    { title: '后端与服务', subtitle: 'Java / Spring Cloud', level: 90, icon: <Database className="w-5 h-5 text-[#af52de]" />, className: 'md:col-span-2', glow: 'rgba(175, 82, 222, 0.25)' },
    { title: '云原生运维', subtitle: 'Docker & CentOS', level: 85, icon: <Share2 className="w-5 h-5 text-[#30b0c7]" />, className: '', glow: 'rgba(48, 176, 199, 0.25)' },
    { title: '工程实践', subtitle: '架构与性能调优', level: 88, icon: <Zap className="w-5 h-5 text-[#f6b500]" />, className: '', glow: 'rgba(246, 181, 0, 0.25)' }
  ]

  return (
    <section ref={containerRef} className="section-padding bg-black border-t border-white/[0.08]">
      <div className="container-wide px-6 lg:px-12">
        <div className="mb-16">
          <h2 className="font-display text-4xl sm:text-6xl text-white mb-4">
            <BlurText text="技术" delay={0.1} /> <span className="text-white/50 font-light">架构</span>
          </h2>
          <p className="text-white/40 text-base max-w-xl font-light leading-relaxed">
            从数据模型设计到前端交互响应，沉淀全栈工程能力与高可用服务架构。
          </p>
        </div>
        
        <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <TiltedCard key={idx} className={`bento-item ${item.className}`} maxRotation={10} scaleOnHover={1.02}>
              <SpotlightCard
                spotlightColor={item.glow}
                className="p-8 sm:p-10 flex flex-col justify-between group cursor-pointer border transition-all duration-300 rounded-2xl hover:border-white/20 h-full min-h-[220px]"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white/70" />
                </div>
                <div className="mt-12">
                  <h4 className="font-display text-xs font-normal uppercase tracking-wider text-white/40 mb-2">
                    <ShinyText text={item.subtitle} speed={5} color="#86868b" />
                  </h4>
                  <h3 className="font-display text-2xl mb-6 text-white">{item.title}</h3>
                  
                  {/* 熟练度指示条 */}
                  <ProgressBar level={item.level} delay={idx * 0.12} />
                </div>
              </SpotlightCard>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  )
}


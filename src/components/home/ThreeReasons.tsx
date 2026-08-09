import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, ZapOff, ArrowRight } from 'lucide-react'
import type { HighlightCard } from '@/types'
import { gsap } from 'gsap'
import { SpotlightCard, TiltedCard, BlurText, ShinyText } from '@/components/reactbits'

export default function ThreeReasons({ highlights }: { highlights: HighlightCard[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.reason-card')
      cards?.forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 65%',
              scrub: true,
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const spotlightColors = [
    'rgba(0, 113, 227, 0.25)',
    'rgba(175, 82, 222, 0.25)',
    'rgba(246, 181, 0, 0.25)',
  ]

  return (
    <section ref={sectionRef} className="section-padding bg-black border-t border-white/[0.08] relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--color-primary)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-5xl text-white">
            <BlurText text="选择我的" delay={0.1} /> <span className="text-white/60 font-light">3 个理由</span>
          </h2>
          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-6" />
        </motion.div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h, i) => (
            <div key={h.title} className="reason-card">
              <TiltedCard maxRotation={10} scaleOnHover={1.03}>
                <SpotlightCard
                  spotlightColor={spotlightColors[i % spotlightColors.length]}
                  className="group p-8 sm:p-10 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="text-white/80 mb-6 transition-transform duration-300 group-hover:scale-110">
                      {i === 0 && <Zap size={36} strokeWidth={1.5} className="text-[#0071e3]" />}
                      {i === 1 && <Shield size={36} strokeWidth={1.5} className="text-[#af52de]" />}
                      {i === 2 && <ZapOff size={36} strokeWidth={1.5} className="text-[#f6b500]" />}
                    </div>
                    <h3 className="font-display text-xl text-white group-hover:text-white transition-colors duration-200">
                      {h.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em]">
                      <ShinyText text={h.subtitle} speed={6} color="#86868b" />
                    </p>
                    <p className="mt-4 text-white/50 text-xs sm:text-sm leading-relaxed transition-colors duration-200 font-light">
                      {h.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-1.5 text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <span className="text-[10px] font-normal uppercase tracking-wider">了解更多</span>
                    <ArrowRight size={12} className="text-white/60" />
                  </div>
                </SpotlightCard>
              </TiltedCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


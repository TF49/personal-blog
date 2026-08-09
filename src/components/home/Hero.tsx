import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Mail, MessageCircleMore } from 'lucide-react'
import { profile } from '@/data/profile'
import { highlights } from '@/data/highlights'
import { gsap } from 'gsap'
import { Particles, ShinyText, Magnet, ClickSpark, SpotlightCard, BlurText, SplitText, CircularText } from '@/components/reactbits'
import { Sparkles } from 'lucide-react'

export default function Hero() {
  const githubLink = profile.social.find((item) => item.name === 'GitHub')?.url
  
  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Badge entrance
      if (badgeRef.current) {
        gsap.fromTo(badgeRef.current, 
          { opacity: 0, scale: 0.9, x: -20 },
          { opacity: 1, scale: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        )
      }
      
      // Tech stack card entrance
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { opacity: 0, x: 30, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 1.0, delay: 0.5, ease: 'power3.out' }
        )
      }

      // Apple-style ScrollTrigger Scrubbing (Scale down, fade & push back as you scroll down)
      gsap.to(contentRef.current, {
        scale: 0.92,
        opacity: 0.2,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black px-4 sm:px-8 lg:px-12 pb-16 pt-24 lg:pt-28">
      {/* React Bits Particles Canvas Background */}
      <Particles particleCount={65} particleColor="rgba(0, 113, 227, 0.4)" lineColor="rgba(175, 82, 222, 0.15)" />

      {/* Floating Circular Rotating Text Stamp */}
      <div className="hidden xl:block absolute top-28 right-16 z-20 pointer-events-auto">
        <Magnet strength={0.3}>
          <CircularText
            text="FULLSTACK DEVELOPER • LINUX SYSADMIN • TF49 BLOG • "
            radius={55}
            spinDuration={18}
            centerIcon={<Sparkles size={16} className="text-[#0071e3]" />}
          />
        </Magnet>
      </div>

      {/* Apple-style deep ambient blue/purple glow matching site design system */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[5%] w-[800px] h-[800px] bg-[#0071e3]/12 rounded-full blur-[180px] opacity-80" />
        <div className="absolute bottom-[5%] left-[0%] w-[600px] h-[600px] bg-[#af52de]/8 rounded-full blur-[160px]" />
      </div>

      <div 
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-2 sm:px-6 lg:px-10 origin-center will-change-transform"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Left Column: Greeting, Name, Intro & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-7 sm:space-y-8">
            <div ref={badgeRef} className="inline-flex items-center gap-2.5 rounded-full border border-[#0071e3]/20 bg-[#0071e3]/10 px-5 py-2 text-xs sm:text-sm text-white/80 backdrop-blur-md shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#0071e3] animate-pulse" />
              <ShinyText text="在校求职 · 全栈开发 / Linux 运维" speed={4} shineColor="#0071e3" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#0071e3] mb-3">
                <BlurText text="你好，我是" delay={0.3} animateBy="letters" />
              </p>
              
              <h1 className="font-display text-6xl sm:text-8xl xl:text-9xl font-black text-white leading-[1.05] tracking-tight">
                <SplitText text={profile.name} delay={0.5} stagger={0.05} animation="popIn" />
              </h1>
              
              <h2 className="mt-4 font-display text-2xl sm:text-4xl xl:text-5xl font-bold leading-tight text-white/90">
                <BlurText text={profile.title} delay={0.7} animateBy="words" />
              </h2>
            </div>

            <p className="text-sm sm:text-base xl:text-lg leading-relaxed text-white/65 font-light max-w-3xl">
              {profile.bio}
            </p>

            {/* Social Pill Badges */}
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-white/75 pt-1">
              <Magnet strength={0.2}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md hover:border-white/20 transition-colors">
                  <MessageCircleMore size={16} className="text-[#0071e3]" />
                  微信 {profile.wechat}
                </div>
              </Magnet>
              <Magnet strength={0.2}>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all hover:bg-white/10 backdrop-blur-md"
                >
                  <Mail size={16} className="text-[#0071e3]" />
                  {profile.email}
                </a>
              </Magnet>
              {githubLink && (
                <Magnet strength={0.2}>
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 transition-all hover:bg-white/10 backdrop-blur-md"
                  >
                    <Github size={16} className="text-[#0071e3]" />
                    GitHub / TF49
                  </a>
                </Magnet>
              )}
            </div>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-3">
              <Magnet strength={0.3}>
                <ClickSpark sparkColor="#0071e3" sparkCount={14}>
                  <Link 
                    to="/about" 
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0071e3] to-[#005bb5] px-8 py-4 text-sm sm:text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,113,227,0.5)]"
                  >
                    <span>查看个人介绍</span>
                    <ArrowRight className="ml-2.5 h-5 w-5" />
                  </Link>
                </ClickSpark>
              </Magnet>
              <Magnet strength={0.3}>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm sm:text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40"
                >
                  浏览博客文章
                </Link>
              </Magnet>
            </div>
          </div>

          {/* Right Column: Direction / Core Stack Vertical Card Stack */}
          <div ref={cardRef} className="lg:col-span-5 w-full">
            <SpotlightCard 
              spotlightColor="rgba(0, 113, 227, 0.25)" 
              className="p-8 sm:p-10 xl:p-12 backdrop-blur-3xl bg-[#121216]/80 border border-white/10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
                <span className="text-xs sm:text-sm font-mono font-medium tracking-widest text-white/50 uppercase">
                  当前关注的方向
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3] animate-pulse" />
              </div>

              <div className="flex flex-col gap-5">
                {highlights.slice(0, 3).map((highlight, index) => (
                  <div 
                    key={index} 
                    className="group relative p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#0071e3]/45 hover:bg-white/[0.06] transition-all duration-300"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-[#0071e3] block mb-1.5">
                      {highlight.title}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl xl:text-3xl font-black tracking-wider text-white uppercase mb-2.5">
                      {highlight.subtitle}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-white/65 font-light">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[9px] font-normal uppercase tracking-[0.3em] text-white/30">Scroll</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#0071e3] to-transparent"
        />
      </motion.div>
    </section>
  )
}
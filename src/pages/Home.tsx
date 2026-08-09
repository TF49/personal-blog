import { useEffect, useState, useRef, lazy, Suspense } from 'react'

function LazyFallback() {
  return (
    <div className="section-padding flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getStats, getHighlights, getTimeline, getRecentArticles, getHomeSnapshot } from '@/api'
import type { StatBlock, HighlightCard, TimelineEvent, Article } from '@/types'
import { ArrowRight } from 'lucide-react'
import { animateStagger, animateCounter } from '@/utils/gsapAnimations'
import { gsap } from 'gsap'

import { SpotlightCard, BlurText, Magnet, ScrollHighlightText } from '@/components/reactbits'
import Hero from '@/components/home/Hero'
import ThreeReasons from '@/components/home/ThreeReasons'
import CustomCursor from '@/components/CustomCursor'
import SEO from '@/components/SEO'
import { profile } from '@/data/profile'

// Lazy Loaded Components - Loaded on Demand
const ProjectShowcase = lazy(() => import('@/components/home/ProjectShowcase'))
const TechBentoGrid = lazy(() => import('@/components/home/TechBentoGrid'))
const TechStackMarquee = lazy(() => import('@/components/home/TechStackMarquee'))
const InteractiveLab = lazy(() => import('@/components/home/InteractiveLab'))
const TechFAQ = lazy(() => import('@/components/home/TechFAQ'))
const CTA = lazy(() => import('@/components/home/CTA'))

type HomeSnapshotState = Awaited<ReturnType<typeof getHomeSnapshot>>

export default function Home() {
  const [stats, setStats] = useState<StatBlock[]>([])
  const [highlights, setHighlights] = useState<HighlightCard[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [snapshot, setSnapshot] = useState<HomeSnapshotState | null>(null)
  
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  
  // Refs for scroll animations
  const timelineRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const articlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStats(getStats())
    setHighlights(getHighlights())
    setTimeline(getTimeline())
    getRecentArticles(6).then(setArticles)
    getHomeSnapshot()
      .then(setSnapshot)
      .catch(() => setSnapshot(null))
      .finally(() => {
        document.dispatchEvent(new Event('prerender-ready'))
      })
  }, [])

  // Setup scroll animations after content is loaded
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline section animation
      if (timelineRef.current) {
        animateStagger(timelineRef.current, '.timeline-item', {
          from: { opacity: 0, x: 30 },
          stagger: 0.15
        })
      }
      
      // Stats counter animation
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll('.stat-counter')
        counters.forEach((counter, index) => {
          const value = Number(stats[index]?.value) || 0
          const unit = stats[index]?.unit || ''
          animateCounter(counter, value, { 
            suffix: unit, 
            delay: index * 0.1 
          })
        })
      }
      
      // Article cards animation
      if (articlesRef.current) {
        animateStagger(articlesRef.current, '.article-card', {
          from: { opacity: 0, y: 30 },
          stagger: 0.1
        })
      }
    })
    
    return () => ctx.revert()
  }, [stats, articles])

  return (
    <>
      <SEO 
        title="首页" 
        description={`${profile.name}的个人博客首页，聚焦全栈开发、Linux 运维实践、项目沉淀与技术文章。`} 
      />
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-[var(--color-primary)] z-[100] origin-left shadow-[0_0_12px_var(--color-primary)]"
        style={{ width: progressWidth }}
      />

      <CustomCursor />

      <Hero />
      <ThreeReasons highlights={highlights} />
      
      <Suspense fallback={<LazyFallback />}>
        <TechBentoGrid />
        <TechStackMarquee />
        <ProjectShowcase />
      </Suspense>

      <section ref={statsRef} className="py-24 bg-[#0a0a0d] border-t border-white/5">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, idx) => (
              <SpotlightCard
                key={s.label}
                spotlightColor={idx === 0 ? 'rgba(0, 113, 227, 0.25)' : idx === 1 ? 'rgba(175, 82, 222, 0.25)' : 'rgba(246, 181, 0, 0.25)'}
                className="text-center p-8 bg-[#121216]/80 border border-white/5 rounded-2xl"
              >
                <div className="stat-counter font-display text-5xl sm:text-6xl text-[var(--color-primary)] drop-shadow-[0_0_15px_rgba(0,113,227,0.3)]">
                  {s.value}{s.unit ?? ''}
                </div>
                <p className="mt-4 text-white/60 font-bold text-xs uppercase tracking-[0.2em]">
                  {s.label}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="section-padding bg-[var(--color-black)] border-t border-white/5">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            <div className="md:w-1/3">
              <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
                <BlurText text="不断进取的" delay={0.1} /> <br />
                <span className="text-[var(--color-primary)]">历程</span>
              </h2>
              <ScrollHighlightText
                text="从课堂作业到可在线访问的实际项目，每一步都在缩短「会写代码」与「能交付产品」之间的距离。"
                className="mt-6 text-sm leading-relaxed font-light text-white/60"
              />
            </div>
            <div className="md:w-2/3 border-l-2 border-white/10 pl-8 md:pl-12 space-y-12 relative">
              {/* Laser energy pulse line overlay */}
              <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-primary)] via-[#af52de] to-transparent shadow-[0_0_8px_var(--color-primary)]" />
              {timeline.map((e) => (
                <div 
                  key={e.year}
                  className="timeline-item relative bg-[#121216] p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-all duration-300 shadow-lg hover:-translate-y-1 group"
                >
                  <div className="absolute -left-[41px] md:-left-[57px] top-8 w-3.5 h-3.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_14px_var(--color-primary)] ring-4 ring-black group-hover:scale-125 transition-transform duration-300" />
                  <span className="font-display text-xl text-[var(--color-primary)] block mb-1">{e.year}</span>
                  <h4 className="font-display text-xl text-white mb-3">{e.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed font-light">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={articlesRef} className="section-padding bg-[#0c0c0e] border-t border-white/5">
        <div className="container-wide px-6 lg:px-12">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-white">
                <BlurText text="最近文章" delay={0.1} />
              </h2>
              <p className="mt-4 text-white/45 text-xs uppercase tracking-widest">技术笔记与感悟</p>
            </div>
            <Magnet strength={0.2}>
              <Link to="/blog" className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-widest text-white/75 hover:text-[var(--color-primary)] transition-colors group px-4 py-2 border border-white/10 rounded-full">
                查看全部 <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnet>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a) => (
              <div key={a.id} className="article-card">
                <SpotlightCard spotlightColor="rgba(0, 113, 227, 0.15)" className="p-0 h-full">
                  <Link
                    to={`/blog/${a.slug}`}
                    className="block group h-full p-8 transition-all duration-500"
                  >
                    <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">
                      {a.category}
                    </div>
                    <h3 className="font-display text-xl text-white group-hover:text-[var(--color-primary)] transition-colors duration-300 line-clamp-2 leading-snug">
                      {a.title}
                    </h3>
                    <p className="mt-4 text-sm text-white/60 line-clamp-2 leading-relaxed font-light">
                      {a.summary}
                    </p>
                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/70 transition-colors">
                      <span>{a.date}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </section>


      <Suspense fallback={<LazyFallback />}>
        <InteractiveLab repos={snapshot?.pinnedRepos} githubError={snapshot?.githubError} />
        <TechFAQ />
        <CTA />
      </Suspense>
    </>
  )
}

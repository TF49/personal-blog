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

// Critical Components - Loaded Immediately
import Hero from '@/components/home/Hero'
import ThreeReasons from '@/components/home/ThreeReasons'
import CustomCursor from '@/components/CustomCursor'
import SEO from '@/components/SEO'
import { profile } from '@/data/profile'

// Lazy Loaded Components - Loaded on Demand
const TechDecomposition = lazy(() => import('@/components/home/TechDecomposition'))
const ProjectShowcase = lazy(() => import('@/components/home/ProjectShowcase'))
const InnovationPhilosophy = lazy(() => import('@/components/home/InnovationPhilosophy'))
const TechStackMarquee = lazy(() => import('@/components/home/TechStackMarquee'))
const TechBentoGrid = lazy(() => import('@/components/home/TechBentoGrid'))
const SkillMastery = lazy(() => import('@/components/home/SkillMastery'))
const TechRadar = lazy(() => import('@/components/home/TechRadar'))
const PerformanceDashboard = lazy(() => import('@/components/home/PerformanceDashboard'))
const IndustryNews = lazy(() => import('@/components/home/IndustryNews'))
const ExplodedTechView = lazy(() => import('@/components/home/ExplodedTechView'))
const TechnicalWhitepaper = lazy(() => import('@/components/home/TechnicalWhitepaper'))
const InteractiveLab = lazy(() => import('@/components/home/InteractiveLab'))
const DevWorkflow = lazy(() => import('@/components/home/DevWorkflow'))
const MilestoneProgress = lazy(() => import('@/components/home/MilestoneProgress'))
const GlobalNetwork = lazy(() => import('@/components/home/GlobalNetwork'))
const TechFAQ = lazy(() => import('@/components/home/TechFAQ'))
const PowerRing = lazy(() => import('@/components/home/PowerRing'))
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
        className="fixed top-0 left-0 h-1 bg-[var(--color-primary)] z-[100] origin-left"
        style={{ width: progressWidth }}
      />

      <CustomCursor />

      <Hero />
      <ThreeReasons highlights={highlights} />
      <Suspense fallback={<LazyFallback />}>
        <TechDecomposition />
        <ProjectShowcase />
        <InnovationPhilosophy />
        <TechStackMarquee />
        <TechBentoGrid />
        <SkillMastery />
        <TechRadar />
        <PerformanceDashboard metrics={snapshot?.metrics} />
        <IndustryNews articles={snapshot?.recentArticles} />
        <ExplodedTechView />
        <TechnicalWhitepaper articles={snapshot?.featuredArticles} />
        <InteractiveLab repos={snapshot?.pinnedRepos} githubError={snapshot?.githubError} />
        <DevWorkflow />
        <MilestoneProgress />
        <PowerRing />
      </Suspense>

      <section ref={statsRef} className="py-32 bg-[var(--color-surface)]">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="stat-counter font-display text-5xl sm:text-6xl text-[var(--color-primary)]">
                  {s.value}{s.unit ?? ''}
                </div>
                <p className="mt-6 text-white font-bold text-xs uppercase tracking-[0.2em] opacity-60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="section-padding bg-white">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row gap-16 lg:gap-32">
            <div className="md:w-1/3">
              <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-black)] leading-tight">
                不断进取的 <br />
                <span className="text-[var(--color-primary)]">历程</span>
              </h2>
              <p className="mt-8 text-[var(--color-muted)] text-sm leading-relaxed">
                从课堂作业到可在线访问的实际项目，每一步都在缩短「会写代码」与「能交付产品」之间的距离。
              </p>
            </div>
            <div className="md:w-2/3 border-l border-gray-100 pl-12 space-y-16">
              {timeline.map((e) => (
                <div 
                  key={e.year}
                  className="timeline-item relative"
                >
                  <div className="absolute -left-[53px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
                  <span className="font-display text-2xl text-[var(--color-primary)] block mb-2">{e.year}</span>
                  <h4 className="font-display text-xl text-[var(--color-black)] mb-4">{e.title}</h4>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={articlesRef} className="section-padding bg-[var(--color-surface)]">
        <div className="container-wide px-6 lg:px-12">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-white">最近文章</h2>
              <p className="mt-4 text-white/45 text-xs uppercase tracking-widest">技术笔记与感悟</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-widest text-white/75 hover:text-[var(--color-primary)] transition-colors group">
              查看全部 <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((a) => (
              <div key={a.id} className="article-card">
                <Link
                  to={`/blog/${a.slug}`}
                  className="block group h-full bg-white p-10 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-6">
                    {a.category}
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-black)] group-hover:text-[var(--color-primary)] transition-colors duration-300 line-clamp-2 leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-6 text-sm text-[var(--color-muted)] line-clamp-2 leading-loose">
                    {a.summary}
                  </p>
                  <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{a.date}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<LazyFallback />}>
        <GlobalNetwork />
        <TechFAQ />
        <CTA />
      </Suspense>
    </>
  )
}

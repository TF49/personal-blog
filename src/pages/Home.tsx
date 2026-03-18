import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getStats, getHighlights, getTimeline, getRecentArticles, getHomeSnapshot } from '@/api'
import type { StatBlock, HighlightCard, TimelineEvent, Article } from '@/types'
import { ArrowRight } from 'lucide-react'

// Home Components
import Hero from '@/components/home/Hero'
import ThreeReasons from '@/components/home/ThreeReasons'
import TechDecomposition from '@/components/home/TechDecomposition'
import ProjectShowcase from '@/components/home/ProjectShowcase'
import InnovationPhilosophy from '@/components/home/InnovationPhilosophy'
import TechStackMarquee from '@/components/home/TechStackMarquee'
import TechBentoGrid from '@/components/home/TechBentoGrid'
import SkillMastery from '@/components/home/SkillMastery'
import TechRadar from '@/components/home/TechRadar'
import PerformanceDashboard from '@/components/home/PerformanceDashboard'
import IndustryNews from '@/components/home/IndustryNews'
import ExplodedTechView from '@/components/home/ExplodedTechView'
import TechnicalWhitepaper from '@/components/home/TechnicalWhitepaper'
import InteractiveLab from '@/components/home/InteractiveLab'
import DevWorkflow from '@/components/home/DevWorkflow'
import MilestoneProgress from '@/components/home/MilestoneProgress'
import GlobalNetwork from '@/components/home/GlobalNetwork'
import TechFAQ from '@/components/home/TechFAQ'
import Counter from '@/components/home/Counter'
import PowerRing from '@/components/home/PowerRing'
import CTA from '@/components/home/CTA'

// Shared Components
import CustomCursor from '@/components/CustomCursor'
import SEO from '@/components/SEO'

type HomeSnapshotState = Awaited<ReturnType<typeof getHomeSnapshot>>

export default function Home() {
  const [stats, setStats] = useState<StatBlock[]>([])
  const [highlights, setHighlights] = useState<HighlightCard[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [snapshot, setSnapshot] = useState<HomeSnapshotState | null>(null)
  
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

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

  return (
    <>
      <SEO 
        title="首页" 
        description="持久充满能量的个人博客 - 驱动数字世界的持久动力，探索极致性能的技术边界。" 
      />
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-[var(--color-primary)] z-[100] origin-left"
        style={{ width: progressWidth }}
      />

      <CustomCursor />

      <Hero />
      <ThreeReasons highlights={highlights} />
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

      <section className="py-32 bg-[var(--color-surface)]">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <Counter value={s.value} unit={s.unit ?? ''} />
                <p className="mt-6 text-[var(--color-black)] font-bold text-xs uppercase tracking-[0.2em] opacity-60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
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
                <motion.div 
                  key={e.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[53px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
                  <span className="font-display text-2xl text-[var(--color-primary)] block mb-2">{e.year}</span>
                  <h4 className="font-display text-xl text-[var(--color-black)] mb-4">{e.title}</h4>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">{e.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-wide px-6 lg:px-12">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-[var(--color-black)]">最近文章</h2>
              <p className="mt-4 text-[var(--color-muted)] text-xs uppercase tracking-widest">技术笔记与感悟</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-black)] hover:text-[var(--color-primary)] transition-colors group">
              查看全部 <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlobalNetwork />
      <TechFAQ />
      <CTA />
    </>
  )
}

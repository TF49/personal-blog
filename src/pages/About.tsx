import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProfile, getTechStack, getTimeline } from '@/api'
import type { AuthorProfile } from '@/types'
import { categoryLabels } from '@/data/techStack'
import { ArrowRight } from 'lucide-react'

export default function About() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null)
  const [techStack] = useState(() => getTechStack())
  const [timeline] = useState(() => getTimeline())

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  if (!profile) {
    return (
      <div className="section-padding text-center text-[var(--color-muted)] bg-white min-h-screen flex items-center justify-center font-display uppercase tracking-widest text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          正在初始化系统...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* 关于我 头部 - 工业简约风 */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[var(--color-black)] text-white">
        <div className="container-narrow relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">核心档案资料</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-8 tracking-tighter">
              {profile.name} <span className="text-[var(--color-primary)]">.</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <p className="text-xl sm:text-2xl text-white/80 font-light leading-relaxed">
                {profile.title}
              </p>
              <p className="text-lg text-white/40 font-light leading-loose">
                {profile.bio}
              </p>
            </div>
          </motion.div>
        </div>
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
      </section>

      {/* 联系方式条 */}
      <section className="py-12 border-y border-gray-100 bg-[var(--color-surface)]">
        <div className="container-narrow">
          <div className="flex flex-wrap justify-between items-center gap-8">
            <div className="flex items-center gap-12">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">微信</div>
                <div className="font-display text-lg text-[var(--color-black)]">{profile.wechat}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">邮件</div>
                <a href={`mailto:${profile.email}`} className="font-display text-lg text-[var(--color-black)] hover:text-[var(--color-primary)] transition-colors">{profile.email}</a>
              </div>
            </div>
            <div className="flex gap-4">
              {profile.social.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-black)] hover:text-white transition-all duration-300"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈 - 工业网格 */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="mb-20">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-6">技术 <span className="text-[var(--color-primary)]">储备</span></h2>
            <div className="w-20 h-1 bg-[var(--color-primary)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-gray-100">
            {Object.entries(techStack).map(([cat, items]) => (
              <div
                key={cat}
                className="p-10 border-r border-b last:border-r-0 border-gray-100 group hover:bg-[var(--color-surface)] transition-colors duration-500"
              >
                <h3 className="font-display text-xs uppercase tracking-[0.3em] text-[var(--color-primary)] mb-8">
                  {categoryLabels[cat] ?? cat}
                </h3>
                <div className="space-y-4">
                  {items.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between group/item"
                    >
                      <span className="text-lg text-[var(--color-black)] font-light">{t.name}</span>
                      <div className="w-12 h-px bg-gray-100 group-hover/item:w-20 group-hover/item:bg-[var(--color-primary)] transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 成长历程 - 垂直流水线 */}
      <section className="section-padding bg-[var(--color-black)] text-white">
        <div className="container-narrow">
          <div className="mb-32 text-center">
            <h2 className="font-display text-4xl sm:text-6xl mb-6">进取 <span className="text-[var(--color-primary)]">历程</span></h2>
            <p className="text-white/40 text-xs uppercase tracking-[0.5em]">从学术基石到工程卓越</p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
            {timeline.map((e, i) => (
              <motion.div
                key={e.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative mb-24 last:mb-0 flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-1/2 flex items-center justify-center md:px-12">
                  <div className={`w-full p-10 border border-white/5 bg-white/[0.02] backdrop-blur-sm ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <span className="font-display text-3xl text-[var(--color-primary)] mb-4 block">{e.year}</span>
                    <h4 className="font-display text-xl mb-4 text-white uppercase tracking-widest">{e.title}</h4>
                    <p className="text-white/40 font-light leading-relaxed">{e.description}</p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full -translate-x-1/2 shadow-[0_0_15px_var(--color-primary)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center">
        <Link to="/blog" className="btn-primary group">
          进入博客空间
          <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </Link>
      </section>
    </div>
  )
}

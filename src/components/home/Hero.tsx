import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Mail, MessageCircleMore } from 'lucide-react'
import { profile } from '@/data/profile'
import { highlights } from '@/data/highlights'

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const githubLink = profile.social.find((item) => item.name === 'GitHub')?.url

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-black)] px-6 pb-20 pt-32">
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--color-primary)] rounded-full blur-[160px]" 
        />
        <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full border border-white/10 bg-white/[0.03] blur-3xl" />
        <div className="absolute right-[12%] top-[28%] h-56 w-56 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(246,181,0,0.22),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[1320px] items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid w-full gap-16 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:items-end"
        >
          <div className="text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70 backdrop-blur-2xl">
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]" />
              Personal Introduction / Full Stack / Linux Ops
            </div>
            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">
              你好，我是
            </p>
            <h1 className="mt-5 font-display text-5xl leading-none text-white sm:text-7xl lg:text-[6.5rem]">
              {profile.name}
            </h1>
            <h2 className="mt-6 max-w-4xl text-2xl font-light leading-tight text-white/88 sm:text-4xl lg:text-5xl">
              {profile.title}
            </h2>
            <p className="mt-8 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              {profile.bio}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-white/70">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3">
                <MessageCircleMore size={16} className="text-[var(--color-primary)]" />
                微信 {profile.wechat}
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 transition-colors hover:border-[var(--color-primary)]/40 hover:text-white"
              >
                <Mail size={16} className="text-[var(--color-primary)]" />
                {profile.email}
              </a>
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 transition-colors hover:border-[var(--color-primary)]/40 hover:text-white"
                >
                  <Github size={16} className="text-[var(--color-primary)]" />
                  GitHub / TF49
                </a>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-5">
              <Link to="/about" className="btn-primary group">
                查看个人介绍
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/blog" className="btn-dark">
                浏览博客文章
              </Link>
            </div>
          </div>

          <div className="panel-dark relative overflow-hidden rounded-[32px] p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(246,181,0,0.16),transparent_32%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%)]" />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-white/45">当前关注</p>
              <div className="mt-6 space-y-4">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--color-primary)]">
                      {item.title}
                    </div>
                    <div className="mt-3 font-display text-2xl text-white">{item.subtitle}</div>
                    <p className="mt-3 text-sm leading-7 text-white/65">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

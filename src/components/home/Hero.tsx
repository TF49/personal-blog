import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import HeroSignalPanel from './HeroSignalPanel'

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-[var(--color-black)] overflow-hidden px-6 pt-28 pb-20">
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
        className="relative z-10 mx-auto w-full max-w-[1320px] text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-10 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70 backdrop-blur-2xl">
              <Sparkles size={14} className="text-[var(--color-primary)]" />
              Personal Blog / Motion System / Visual Lab
            </div>
          </div>
          <h1 className="font-display text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] text-white tracking-tighter leading-none mb-8">
            No.1
          </h1>
          <div className="space-y-2">
            <p className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight font-extralight uppercase">
              持久充满能量的
            </p>
            <p className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--color-primary)] tracking-tight font-bold uppercase">
              个人博客
            </p>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
            用更强的视觉层次、动态粒子、模块化组件和可交互的内容节奏，把它从“能看”推进到“想多停留几分钟”。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Link to="/blog" className="btn-primary group text-lg px-12 py-5">
            探索能量中心
            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
          <Link to="/about" className="text-white/40 hover:text-white transition-colors tracking-[0.3em] text-xs font-bold uppercase py-5 px-8 border border-white/10 hover:border-white/30">
            品牌故事
          </Link>
        </motion.div>

        <HeroSignalPanel />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-[-84px] left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">向下滚动探索更多</span>
            <div className="w-px h-12 bg-gradient-to-b from-[var(--color-primary)] to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

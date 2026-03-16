import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center bg-[var(--color-black)] overflow-hidden">
      {/* 背景装饰：增强的能量场感 */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--color-primary)] rounded-full blur-[160px]" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
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

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-[-100px] left-1/2 -translate-x-1/2"
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

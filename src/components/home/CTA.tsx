import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-64 bg-[var(--color-primary)] text-white text-center relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-10" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl mb-12 tracking-tighter leading-none">
            准备好 <br />开启新能量吗？
          </h2>
          <p className="text-white/80 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            探索受工业卓越启发的 Web 未来。欢迎技术协作、深度交流以及对极致性能的追求。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/about" className="btn-dark px-16 py-6 group flex items-center gap-6 text-lg">
              即刻开启协作 <ExternalLink size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </Link>
            <Link to="/blog" className="text-white/60 hover:text-white transition-colors tracking-[0.4em] text-xs font-bold uppercase py-6 px-12 border border-white/20 hover:border-white">
              浏览技术文档
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* 底部装饰条 */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10" />
    </section>
  )
}

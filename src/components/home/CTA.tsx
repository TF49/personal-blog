import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { ShinyText, Magnet, ClickSpark, Particles } from '@/components/reactbits'

export default function CTA() {
  return (
    <section className="py-48 bg-[#0071e3] text-white text-center relative overflow-hidden">
      {/* React Bits Ambient Micro Particles */}
      <Particles particleCount={40} particleColor="rgba(255, 255, 255, 0.5)" lineColor="rgba(255, 255, 255, 0.2)" />

      {/* 动态背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-10" 
        />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-12 tracking-tighter leading-none">
            准备好 <br />
            <ShinyText text="开启新能量吗？" speed={3} color="#ffffff" shineColor="#ff9500" />
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            探索受工业卓越启发的 Web 未来。欢迎技术协作、深度交流以及对极致性能的追求。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Magnet strength={0.3}>
              <ClickSpark sparkColor="#ff9500" sparkCount={16}>
                <Link to="/about" className="btn-dark px-12 py-5 group flex items-center gap-4 text-base shadow-2xl">
                  即刻开启协作 <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </ClickSpark>
            </Magnet>
            <Magnet strength={0.3}>
              <Link to="/blog" className="text-white/70 hover:text-white transition-colors tracking-[0.3em] text-xs font-bold uppercase py-5 px-10 border border-white/20 hover:border-white rounded-full backdrop-blur-md">
                浏览技术文档
              </Link>
            </Magnet>
          </div>
        </motion.div>
      </div>
      
      {/* 底部装饰条 */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10" />
    </section>
  )
}


import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export default function GlobalNetwork() {
  return (
    <section className="py-40 bg-[var(--color-black)] relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)]" />
      </div>

      <div className="container-narrow relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">全球连接可用</span>
          </div>
          <h2 className="font-display text-5xl sm:text-7xl text-white mb-10 tracking-tighter">
            连接 <span className="text-[var(--color-primary)]">万物</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['上海', '深圳', '杭州', '北京', '新加坡', '伦敦'].map((city) => (
              <span key={city} className="font-display text-xl md:text-2xl text-white/20 hover:text-white transition-colors duration-300">
                {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 动态数字背书跑马灯 */}
        <div className="mt-40 border-y border-white/5 py-12 overflow-hidden relative">
          <div className="marquee-content gap-20">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {['谷歌云', '微软 Azure', 'AWS 认证', 'Spring 专家', 'React 专家', 'Docker 专家'].map((brand) => (
                  <div key={brand} className="flex items-center gap-4 group">
                    <Award className="w-6 h-6 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
                    <span className="font-display text-2xl text-white/40 group-hover:text-white transition-colors">{brand}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

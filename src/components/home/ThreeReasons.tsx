import { motion } from 'framer-motion'
import { Zap, Shield, ZapOff, ArrowRight } from 'lucide-react'

interface HighlightCard {
  title: string
  subtitle: string
  description: string
}

export default function ThreeReasons({ highlights }: { highlights: HighlightCard[] }) {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-3xl sm:text-5xl text-[var(--color-black)]">
            选择我的 <span className="text-[var(--color-primary)]">3 个理由</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-100 shadow-2xl">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group p-12 lg:p-16 bg-white border-r last:border-r-0 border-gray-100 hover:bg-[var(--color-black)] transition-all duration-700 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-0 bg-[var(--color-primary)] group-hover:h-full transition-all duration-700" />
              <div className="text-[var(--color-primary)] mb-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                {i === 0 && <Zap size={48} strokeWidth={1} />}
                {i === 1 && <Shield size={48} strokeWidth={1} />}
                {i === 2 && <ZapOff size={48} strokeWidth={1} />}
              </div>
              <h3 className="font-display text-2xl lg:text-3xl text-[var(--color-black)] group-hover:text-white transition-colors duration-500">
                {h.title}
              </h3>
              <p className="mt-3 text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em]">
                {h.subtitle}
              </p>
              <p className="mt-8 text-[var(--color-muted)] group-hover:text-white/60 text-base leading-relaxed transition-colors duration-500 font-light">
                {h.description}
              </p>
              <div className="mt-10 flex items-center gap-2 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] font-bold uppercase tracking-widest">探索详情</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

export default function TechRadar() {
  const categories = [
    { name: '编程语言', items: ['Java', 'TypeScript', 'SQL', 'Python'] },
    { name: '框架', items: ['Spring Boot', 'React', 'Next.js', 'Express'] },
    { name: '基础设施', items: ['Docker', 'Kubernetes', 'AWS', 'Linux'] },
    { name: '工具', items: ['Git', 'Jenkins', 'Postman', 'Vite'] }
  ]

  return (
    <section className="py-40 bg-[var(--color-black)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_49px,white_50px)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,white_50px)]" />
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="text-center mb-32">
          <h2 className="font-display text-4xl sm:text-7xl text-white mb-8">
            技术 <span className="text-[var(--color-primary)]">雷达</span>
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.5em]">当前技术导向</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-12 inline-block">
                <div className="w-32 h-32 border border-[var(--color-primary)]/30 rounded-full flex items-center justify-center relative">
                  <div className="w-24 h-24 border border-[var(--color-primary)]/50 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full animate-pulse opacity-20" />
                  </div>
                  <div className="absolute inset-0 border-t border-r border-[var(--color-primary)] rounded-full animate-spin-slow" />
                </div>
                <h4 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[10px] tracking-[0.3em] text-[var(--color-primary)]">
                  {cat.name}
                </h4>
              </div>
              <div className="space-y-4">
                {cat.items.map((item) => (
                  <div key={item} className="text-white/60 hover:text-white transition-colors cursor-default text-lg font-light tracking-wide">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

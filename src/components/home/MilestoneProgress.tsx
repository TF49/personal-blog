import { motion } from 'framer-motion'

export default function MilestoneProgress() {
  const milestones = [
    { year: '2024', title: '全球拓展', desc: '将技术触角延伸至国际领域，开启全球化协作。' },
    { year: '2023', title: '工业级标准', desc: '在核心开发中采用高精度工程标准和规范。' },
    { year: '2022', title: '基础构建', desc: '深钻全栈架构和微服务，打下坚实的技术基础。' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      <div className="container-narrow relative z-10">
        <div className="mb-20 text-center">
          <h2 className="font-display text-4xl sm:text-6xl mb-6">
            发展 <span className="text-[var(--color-primary)]">里程碑</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto" />
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:left-1/2">
          {milestones.map((m, idx) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-24 last:mb-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-20 md:-translate-x-full text-right' : 'md:pl-20'}`}
            >
              <div className="absolute top-0 w-8 h-8 bg-[var(--color-black)] border-4 border-[var(--color-primary)] rounded-full -left-4 md:left-auto md:right-0 md:translate-x-1/2 shadow-[0_0_20px_rgba(196,30,58,0.5)]" />
              <div className="font-display text-4xl text-[var(--color-primary)] mb-2">{m.year}</div>
              <h3 className="font-display text-2xl mb-4 text-white uppercase tracking-widest">{m.title}</h3>
              <p className="text-white/40 text-lg font-light leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

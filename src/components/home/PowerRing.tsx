import { motion } from 'framer-motion'

export default function PowerRing() {
  const items = [
    { title: '超强容量', sub: '极致外壳设计', desc: '在 Spring Boot、React 和云原生环境中的全栈开发能力。' },
    { title: '卓越续航', sub: '持久动力支持', desc: '持续输出高质量技术笔记，保持稳定的学习习惯。' },
    { title: '超低自耗', sub: '锁定核心动力', desc: '专注于整洁代码、Git 工作流和专业工程标准。' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      {/* 背景动效 */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[1px] border-[var(--color-primary)] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[1px] border-white/10 rounded-full animate-spin-slow" />
      </div>

      <div className="container-narrow relative z-10">
        <div className="text-center mb-24">
          <h2 className="font-display text-4xl sm:text-6xl mb-6">
            独特 <span className="text-[var(--color-primary)]">能量环</span>
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.4em]">核心能力展示</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {items.map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center group"
            >
              <div className="font-display text-4xl lg:text-5xl text-[var(--color-primary)] mb-4 transition-transform group-hover:scale-105 duration-500">
                {item.title}
              </div>
              <div className="text-[10px] font-bold tracking-[0.3em] text-white/30 mb-6">{item.sub}</div>
              <p className="text-white/60 text-sm leading-loose max-w-xs mx-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

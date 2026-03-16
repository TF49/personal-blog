import { motion } from 'framer-motion'

export default function DevWorkflow() {
  const steps = [
    { phase: '阶段 01', title: '深度挖掘', desc: '以工业级精度分析需求，识别核心技术挑战。', status: '已完成' },
    { phase: '阶段 02', title: '系统蓝图', desc: '使用现代设计模式架构稳健、可扩展的解决方案。', status: '进行中' },
    { phase: '阶段 03', title: '精密构建', desc: '通过持续集成和测试，编写整洁、可维护的代码。', status: '待定' },
    { phase: '阶段 04', title: '质量锁定', desc: '严格的性能调优和安全审计，确保任务关键型的稳定性。', status: '待定' }
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="md:w-1/2">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-6">
              开发 <br />
              <span className="text-[var(--color-primary)]">工作流</span>
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-[var(--color-muted)] text-xl font-light leading-relaxed">
              我们的工程过程是高端制造原则与敏捷软件开发的融合。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="font-display text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-6 flex items-center gap-4">
                {step.phase}
                <div className="h-px flex-1 bg-[var(--color-primary)]/20" />
              </div>
              <h3 className="font-display text-2xl text-[var(--color-black)] mb-6 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[var(--color-muted)] font-light leading-relaxed mb-8">
                {step.desc}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100">
                <div className={`w-1.5 h-1.5 rounded-full ${step.status === '已完成' ? 'bg-green-500' : step.status === '进行中' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

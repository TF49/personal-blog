import { motion } from 'framer-motion'

export default function PerformanceDashboard() {
  const metrics = [
    { label: '系统在线率', value: '99.9', unit: '%' },
    { label: '响应时间', value: '42', unit: 'ms' },
    { label: '安全等级', value: 'A+', unit: '' },
    { label: '负载能力', value: '10k', unit: 'qps' }
  ]

  return (
    <section className="py-32 bg-white border-y border-gray-100">
      <div className="container-wide px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4">
                {m.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl lg:text-7xl text-[var(--color-black)] tracking-tighter">
                  {m.value}
                </span>
                <span className="font-display text-xl text-[var(--color-muted)]">{m.unit}</span>
              </div>
              <div className="mt-6 h-px w-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '0%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                  className="h-full bg-[var(--color-primary)]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

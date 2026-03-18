import { motion } from 'framer-motion'

type Metric = {
  label: string
  value: string
  unit?: string
}

type PerformanceDashboardProps = {
  metrics?: Metric[]
}

export default function PerformanceDashboard({ metrics }: PerformanceDashboardProps) {
  const items = metrics ?? [
    { label: '文章总数', value: '--' },
    { label: '分类数量', value: '--' },
    { label: '近 30 天更新', value: '--' },
    { label: 'GitHub Stars', value: '--' },
  ]

  return (
    <section className="py-32 bg-white border-y border-gray-100">
      <div className="container-wide px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {items.map((m, idx) => (
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

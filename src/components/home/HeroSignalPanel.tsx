import { motion } from 'framer-motion'
import { ArrowUpRight, Cpu, Orbit, Sparkles } from 'lucide-react'

const metrics = [
  { label: 'Visual Signals', value: '24', detail: 'motion layers', icon: Sparkles },
  { label: 'System Flow', value: '06', detail: 'active modules', icon: Cpu },
  { label: 'Orbit Links', value: '18', detail: 'connected nodes', icon: Orbit },
]

const orbitLabels = ['React', 'TypeScript', 'Motion', 'Design', 'Blog', 'Lab']

export default function HeroSignalPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-2xl shadow-[0_24px_120px_rgba(0,0,0,0.38)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(246,181,0,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(230,0,18,0.16),transparent_30%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/45">Visual Engine</p>
              <h3 className="mt-3 max-w-xl text-left font-display text-2xl text-white sm:text-3xl">
                把博客做成会呼吸的个人数字展厅
              </h3>
            </div>
            <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--color-primary)] sm:flex">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {metrics.map(({ label, value, detail, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + index * 0.1, duration: 0.5 }}
                className="rounded-[24px] border border-white/10 bg-black/25 p-4"
              >
                <div className="flex items-center justify-between text-white/60">
                  <Icon size={16} />
                  <span className="text-[9px] uppercase tracking-[0.3em]">Live</span>
                </div>
                <div className="mt-5 text-left">
                  <div className="font-display text-3xl text-white">{value}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.26em] text-white/45">{label}</div>
                  <div className="mt-4 text-sm text-white/70">{detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/45 p-6 backdrop-blur-2xl shadow-[0_24px_100px_rgba(0,0,0,0.36)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(246,181,0,0.18),transparent_54%)]" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-white/40">Node Orbit</p>
              <p className="mt-2 text-sm leading-relaxed text-white/68">
                让内容区保持阅读效率，同时把首页入口做得更像作品集和实验室。
              </p>
            </div>
          </div>

          <div className="relative mt-8 min-h-[240px]">
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/30 bg-[radial-gradient(circle,rgba(246,181,0,0.16),rgba(246,181,0,0.02)_62%,transparent_72%)]" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/12" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2"
            >
              {orbitLabels.map((label, index) => {
                const angle = (Math.PI * 2 * index) / orbitLabels.length
                const x = Math.cos(angle) * 104
                const y = Math.sin(angle) * 104
                return (
                  <div
                    key={label}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <div className="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75">
                      {label}
                    </div>
                  </div>
                )
              })}
            </motion.div>
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-primary)]/30 bg-black text-center">
              <div>
                <div className="font-display text-2xl text-[var(--color-primary)]">TF</div>
                <div className="text-[9px] uppercase tracking-[0.32em] text-white/45">Core</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

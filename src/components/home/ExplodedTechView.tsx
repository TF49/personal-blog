import { motion } from 'framer-motion'
import { Layout, Cpu, Database, Share2 } from 'lucide-react'

export default function ExplodedTechView() {
  const parts = [
    { id: 'ui', title: '用户界面', offset: -150, icon: <Layout />, desc: '通过 Framer Motion 编排的原子设计系统。' },
    { id: 'logic', title: '业务逻辑', offset: -50, icon: <Cpu />, desc: '使用 React Hooks 的类型安全函数式编程。' },
    { id: 'data', title: '数据流', offset: 50, icon: <Database />, desc: '通过 WebSocket 和 REST 实现实时同步。' },
    { id: 'infra', title: '基础设施', offset: 150, icon: <Share2 />, desc: 'Kubernetes 集群上的 Docker 化微服务。' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white overflow-hidden perspective-1000">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="mb-32 text-center">
          <h2 className="font-display text-4xl sm:text-7xl mb-8">
            爆炸式 <span className="text-[var(--color-primary)]">架构</span>
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.5em]">模块化核心解构</p>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
          {parts.map((part, idx) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, z: part.offset }}
              whileInView={{ opacity: 1, z: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 1 }}
              className="absolute w-full max-w-xl group preserve-3d cursor-pointer"
              style={{ transform: `translateZ(${part.offset}px)` }}
            >
              <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-xl hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-500">
                <div className="flex items-center gap-8">
                  <div className="text-[var(--color-primary)] p-4 bg-black/50 border border-white/5">
                    {part.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl mb-2">{part.title}</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/80 transition-colors">
                      {part.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

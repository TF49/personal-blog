import { motion } from 'framer-motion'
import { Layout, Cpu, Database, Share2 } from 'lucide-react'

export default function ExplodedTechView() {
  const parts = [
    { id: 'ui', title: '用户界面', offset: -120, y: -180, icon: <Layout />, desc: '通过 Framer Motion 编排的原子设计系统。' },
    { id: 'logic', title: '业务逻辑', offset: -40, y: -60, icon: <Cpu />, desc: '使用 React Hooks 的类型安全函数式编程。' },
    { id: 'data', title: '数据流', offset: 40, y: 60, icon: <Database />, desc: '通过 WebSocket 和 REST 实现实时同步。' },
    { id: 'infra', title: '基础设施', offset: 120, y: 180, icon: <Share2 />, desc: 'Kubernetes 集群上的 Docker 化微服务。' }
  ]

  return (
    <section className="py-32 bg-[var(--color-black)] text-white overflow-hidden perspective-2000">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="mb-40 text-center">
          <h2 className="font-display text-4xl sm:text-7xl mb-8">
            爆炸式 <span className="text-[var(--color-primary)]">架构</span>
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.5em]">模块化核心解构</p>
        </div>

        <div className="relative h-[800px] flex items-center justify-center pointer-events-none">
          {parts.map((part, idx) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, z: part.offset * 2, y: part.y * 1.5, rotateX: 45 }}
              whileInView={{ 
                opacity: 1, 
                z: part.offset, 
                y: part.y,
                rotateX: 25,
                transition: { delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }
              }}
              whileHover={{ 
                z: part.offset + 50, 
                scale: 1.05,
                rotateX: 0,
                transition: { duration: 0.4 } 
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute w-full max-w-2xl group preserve-3d cursor-pointer pointer-events-auto"
            >
              <div className="bg-black/40 border border-white/10 p-8 backdrop-blur-2xl hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-500 shadow-2xl">
                <div className="flex items-center gap-8">
                  <div className="text-[var(--color-primary)] p-5 bg-black/60 border border-white/10 rounded-xl">
                    {part.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl mb-3">{part.title}</h3>
                    <p className="text-white/60 text-base font-light leading-relaxed group-hover:text-white transition-colors">
                      {part.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* 装饰线条，增强立体感 */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-primary)] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Layout, Cpu, Database, Share2 } from 'lucide-react'

export default function ExplodedTechView() {
  const parts = [
    { id: 'ui', title: '用户界面', x: -40, y: -280, rotateZ: -2, icon: <Layout />, desc: '通过 Framer Motion 编排的原子设计系统。' },
    { id: 'logic', title: '业务逻辑', x: 40, y: -90, rotateZ: 1, icon: <Cpu />, desc: '使用 React Hooks 的类型安全函数式编程。' },
    { id: 'data', title: '数据流', x: -30, y: 100, rotateZ: -1, icon: <Database />, desc: '通过 WebSocket 和 REST 实现实时同步。' },
    { id: 'infra', title: '基础设施', x: 30, y: 290, rotateZ: 2, icon: <Share2 />, desc: 'Kubernetes 集群上的 Docker 化微服务。' }
  ]

  return (
    <section className="py-40 bg-[var(--color-black)] text-white overflow-hidden perspective-2500">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="mb-56 text-center">
          <h2 className="font-display text-4xl sm:text-7xl mb-8">
            爆炸式 <span className="text-[var(--color-primary)]">架构</span>
          </h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.6em] font-bold">模块化核心解构 / DECONSTRUCTED CORE</p>
        </div>

        <div className="relative h-[1000px] flex items-center justify-center pointer-events-none">
          {parts.map((part, idx) => (
            <motion.div
              key={part.id}
              initial={{ 
                opacity: 0, 
                z: -500, 
                y: part.y * 1.2, 
                x: part.x * 2,
                rotateX: 45,
                rotateZ: part.rotateZ * 5 
              }}
              whileInView={{ 
                opacity: 1, 
                z: 0, 
                y: part.y,
                x: part.x,
                rotateX: 20,
                rotateZ: part.rotateZ,
                transition: { delay: idx * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              whileHover={{ 
                z: 150, 
                x: 0,
                rotateX: 0,
                rotateZ: 0,
                scale: 1.05,
                transition: { duration: 0.5, ease: "circOut" } 
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute w-full max-w-xl group preserve-3d cursor-pointer pointer-events-auto"
            >
              <div className="bg-black/40 border border-white/10 p-10 backdrop-blur-3xl hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-10">
                  <div className="text-[var(--color-primary)] p-6 bg-black/60 border border-white/10 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {part.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl mb-4 tracking-tight">{part.title}</h3>
                    <p className="text-white/50 text-base font-light leading-relaxed group-hover:text-white transition-colors">
                      {part.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* 装饰元素：网格背景 */}
          <div className="absolute inset-0 -z-10 opacity-10 [mask-image:radial-gradient(circle_at_center,white,transparent)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

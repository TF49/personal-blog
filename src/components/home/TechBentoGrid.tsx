import { motion } from 'framer-motion'
import { ArrowRight, Layout, Database, Share2, Zap } from 'lucide-react'

export default function TechBentoGrid() {
  const items = [
    { title: '能量架构', subtitle: 'React & Next.js', level: 95, icon: <Layout className="w-8 h-8" />, className: 'md:col-span-2 md:row-span-2 bg-[var(--color-primary)] text-black' },
    { title: '动力源泉', subtitle: 'Spring Boot', level: 88, icon: <Database className="w-6 h-6" />, className: 'md:col-span-2 bg-[var(--color-dark)] text-white border-white/5' },
    { title: '云端电网', subtitle: 'Docker & K8s', level: 82, icon: <Share2 className="w-6 h-6" />, className: 'bg-[var(--color-surface)] text-white border-white/5' },
    { title: '核心续航', subtitle: '性能优化', level: 90, icon: <Zap className="w-6 h-6" />, className: 'bg-[var(--color-black)] text-white border-white/10' }
  ]

  return (
    <section className="section-padding bg-black">
      <div className="container-wide px-6 lg:px-12">
        <div className="mb-20">
          <h2 className="font-display text-4xl sm:text-6xl text-white mb-6">
            能量 <span className="text-[var(--color-primary)]">矩阵</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl font-light">驱动数字世界的持久动力，探索极致性能的技术边界。</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 flex flex-col justify-between group cursor-pointer border transition-all duration-500 rounded-3xl ${item.className}`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 ${item.className.includes('bg-[var(--color-primary)]') ? 'bg-black/10' : 'bg-white/5'}`}>
                  {item.icon}
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-20">
                <h4 className={`font-display text-xs uppercase tracking-[0.3em] mb-4 ${item.className.includes('text-black') ? 'opacity-60' : 'text-white/40'}`}>{item.subtitle}</h4>
                <h3 className="font-display text-3xl mb-6">{item.title}</h3>
                
                {/* 能量条 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest opacity-60">
                    <span>CAPACITY</span>
                    <span>{item.level}%</span>
                  </div>
                  <div className="energy-bar bg-black/20">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.level}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className={`energy-fill ${item.className.includes('text-black') ? 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]' : ''}`}
                    />
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

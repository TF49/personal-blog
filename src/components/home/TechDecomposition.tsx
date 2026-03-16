import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Zap, Globe, Rocket } from 'lucide-react'

export default function TechDecomposition() {
  const [activeLayer, setActiveLayer] = useState(0)
  const layers = [
    { title: '核心动力', icon: <Cpu />, desc: '高性能后端架构，为复杂业务提供持久动力。', detail: 'POWERFUL ENGINE' },
    { title: '瞬时响应', icon: <Zap />, desc: '极致优化的前端体验，毫秒级交互反馈。', detail: 'INSTANT RESPONSE' },
    { title: '全能适配', icon: <Globe />, desc: '跨平台云端集成，实现多端无缝电力输送。', detail: 'UNIVERSAL ADAPT' },
    { title: '持久续航', icon: <Rocket />, desc: '持续优化的系统性能，确保长期稳定运行。', detail: 'LONG ENDURANCE' }
  ]

  return (
    <section className="section-padding bg-black overflow-hidden relative">
      <div className="container-wide px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          <div className="lg:w-1/2">
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-12 tracking-tighter">
              能量 <br />
              <span className="text-[var(--color-primary)]">解析</span>
            </h2>
            <div className="space-y-4">
              {layers.map((layer, idx) => (
                <button
                  key={layer.title}
                  onClick={() => setActiveLayer(idx)}
                  className={`w-full text-left p-8 transition-all duration-500 rounded-3xl border group relative overflow-hidden ${
                    activeLayer === idx 
                      ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-2xl scale-[1.02]' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl transition-all duration-500 ${activeLayer === idx ? 'bg-[var(--color-primary)] text-black' : 'bg-black/20 text-white/20'}`}>
                      {layer.icon}
                    </div>
                    <div>
                      <h4 className={`font-display text-xl mb-1 ${activeLayer === idx ? 'text-white' : 'text-white/40'}`}>
                        {layer.title}
                      </h4>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${activeLayer === idx ? 'text-[var(--color-primary)]' : 'text-white/20'}`}>
                        {layer.detail}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative perspective-2000 w-full h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, rotateY: 45, x: 100 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -45, x: -100 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-center p-16 bg-[var(--color-dark)] border border-white/10 text-white rounded-[40px] shadow-2xl shadow-[var(--color-primary)]/10"
              >
                <div className="absolute top-0 right-0 p-12 text-[15rem] font-display text-white/5 pointer-events-none select-none leading-none">
                  {activeLayer + 1}
                </div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[var(--color-primary)] mb-10 w-20 h-20"
                >
                  {layers[activeLayer].icon}
                </motion.div>
                
                <h3 className="font-display text-5xl mb-8">{layers[activeLayer].title}</h3>
                <p className="text-white/60 leading-relaxed text-2xl font-light max-w-md">
                  {layers[activeLayer].desc}
                </p>
                
                <div className="mt-16 flex items-center gap-6">
                  <div className="h-px w-20 bg-[var(--color-primary)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--color-primary)]">ENERGY MATRIX CERTIFIED</span>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-[var(--color-primary)]/10 -translate-x-10 translate-y-10 -z-10 blur-3xl rounded-[40px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

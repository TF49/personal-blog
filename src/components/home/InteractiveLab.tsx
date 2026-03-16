import { useState } from 'react'
import { motion } from 'framer-motion'

export default function InteractiveLab() {
  const [activeTab, setActiveTab] = useState('性能')
  
  const demos = {
    '性能': {
      title: '实时分析',
      status: '已优化',
      metrics: [
        { label: '延迟', value: '45ms' },
        { label: '吞吐量', value: '1.2k/s' },
        { label: '加载时间', value: '0.8s' }
      ],
      desc: '高精度监控界面，展示亚秒级响应时间和资源优化成果。'
    },
    '安全': {
      title: '盾牌保护',
      status: '已加密',
      metrics: [
        { label: '加密', value: 'AES-256' },
        { label: '认证', value: 'OAuth 2.1' },
        { label: '传输', value: 'TLS 1.3' }
      ],
      desc: '企业级安全实现，具备多层身份验证和数据完整性锁定。'
    },
    '扩展': {
      title: '缩放地平线',
      status: '弹性',
      metrics: [
        { label: '节点', value: '24' },
        { label: '在线率', value: '99.99%' },
        { label: '备份', value: '同步' }
      ],
      desc: '云原生基础设施演示，展示弹性伸缩和高可用集群。'
    }
  }

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="mb-20">
          <h2 className="font-display text-4xl sm:text-6xl mb-6">
            交互式 <span className="text-[var(--color-primary)]">实验室</span>
          </h2>
          <p className="text-white/40 text-lg font-light tracking-wide uppercase tracking-[0.3em]">工程游乐场</p>
        </div>

        <div className="bg-[#111] border border-white/5 shadow-2xl overflow-hidden">
          <div className="flex border-b border-white/5">
            {Object.keys(demos).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-6 font-display text-xs uppercase tracking-[0.3em] transition-all relative ${
                  activeTab === tab ? 'text-[var(--color-primary)] bg-white/5' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-12 lg:p-20 flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-8">
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                  {demos[activeTab as keyof typeof demos].status}
                </span>
              </div>
              <h3 className="font-display text-4xl mb-6">{demos[activeTab as keyof typeof demos].title}</h3>
              <p className="text-white/40 text-lg font-light leading-relaxed mb-12">
                {demos[activeTab as keyof typeof demos].desc}
              </p>
              
              <div className="grid grid-cols-3 gap-8">
                {demos[activeTab as keyof typeof demos].metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{m.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/20">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full aspect-video bg-black/40 border border-white/5 relative flex items-center justify-center overflow-hidden">
               {/* 这里可以放一个更复杂的动画演示 */}
               <div className="absolute inset-0 opacity-20">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] blur-3xl" />
               </div>
               <motion.div 
                 animate={{ 
                   scale: [1, 1.1, 1],
                   rotate: [0, 5, -5, 0]
                 }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="relative z-10 w-32 h-32 border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center"
               >
                 <div className="w-20 h-20 border border-[var(--color-primary)]/40 rounded-full animate-ping" />
                 <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-xl" />
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

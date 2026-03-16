import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function IndustryNews() {
  const news = [
    { date: '2024年10月12日', title: '通过混沌工程提升分布式 system 可靠性', category: '系统架构', summary: '探讨如何在复杂分布式系统中引入受控故障，以验证系统的自我修复能力。' },
    { date: '2024年9月28日', title: 'Web 性能的未来：下一代渲染模式解析', category: '前端开发', summary: '深入研究 React Server Components 和流式渲染如何重塑现代 Web 开发。' },
    { date: '2024年9月15日', title: '在微服务中实现零信任架构', category: '信息安全', summary: '从网络边界防御转向以身份为中心的持续验证安全模型实践指南。' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      {/* 装饰性光晕 */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_70%)] opacity-10" />
      
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-32 border-b border-white/10 pb-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-8 tracking-tighter">行业 <span className="text-[var(--color-primary)]">动态</span></h2>
            <p className="text-white/40 text-xl font-light">追踪前沿技术演进，捕捉工业级工程实践的最新风向。</p>
          </div>
          <Link to="/blog" className="mt-12 md:mt-0 flex items-center text-[10px] font-bold uppercase tracking-[0.5em] hover:text-[var(--color-primary)] transition-all group py-4 px-8 border border-white/10 hover:border-[var(--color-primary)] whitespace-nowrap">
            探索全部深度文章 <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:divide-x divide-white/10">
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="lg:pl-16 first:pl-0 group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px bg-[var(--color-primary)]" />
                <div className="text-[var(--color-primary)] font-display text-xs tracking-[0.4em] uppercase">
                  {item.date}
                </div>
              </div>
              
              <h3 className="font-display text-3xl mb-8 group-hover:text-[var(--color-primary)] transition-colors leading-tight min-h-[4rem]">
                {item.title}
              </h3>
              
              <p className="text-white/40 text-lg font-light leading-relaxed mb-10 line-clamp-3 group-hover:text-white/60 transition-colors">
                {item.summary}
              </p>
              
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 group-hover:border-[var(--color-primary)]/40 group-hover:bg-[var(--color-primary)]/5 transition-all">
                <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-[var(--color-primary)]">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

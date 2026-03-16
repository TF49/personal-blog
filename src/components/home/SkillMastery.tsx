import { motion } from 'framer-motion'
import { Layout, Database, Share2, Cpu } from 'lucide-react'

export default function SkillMastery() {
  const skills = [
    { name: '前端开发', level: 95, icon: <Layout />, items: ['React', 'Next.js', 'Tailwind', 'Motion'] },
    { name: '后端开发', level: 88, icon: <Database />, items: ['Spring Boot', 'Node.js', 'PostgreSQL', 'Redis'] },
    { name: '运维部署', level: 82, icon: <Share2 />, items: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'] },
    { name: '架构设计', level: 85, icon: <Cpu />, items: ['微服务', '整洁代码', '系统设计'] }
  ]

  return (
    <section className="section-padding bg-[var(--color-surface)] relative overflow-hidden">
      {/* 装饰性网格背景 */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-end mb-32 border-b border-gray-200 pb-12">
          <div className="lg:w-1/2">
            <h2 className="font-display text-5xl sm:text-7xl text-[var(--color-black)] mb-8 tracking-tighter">
              技能 <span className="text-[var(--color-primary)]">精通</span>
            </h2>
            <p className="text-[var(--color-muted)] text-xl font-light leading-relaxed max-w-md">
              通过工业级性能指标和持续集成，量化技术专业知识与工程实践。
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300 mb-2">更新于 2024</div>
            <div className="text-[var(--color-primary)] font-display text-sm tracking-widest">NO.1 PERFORMANCE MATRIX</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-12 border border-gray-100 relative group overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="p-4 bg-[var(--color-primary)]/5 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500">
                  {skill.icon}
                </div>
                <div className="font-display text-4xl font-bold text-[var(--color-primary)] opacity-10 group-hover:opacity-100 transition-opacity">
                  {skill.level}
                </div>
              </div>
              <h3 className="font-display text-2xl text-[var(--color-black)] mb-8 uppercase tracking-wider">{skill.name}</h3>
              
              {/* 仪表盘进度条 */}
              <div className="h-1 w-full bg-gray-50 mb-10 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-[var(--color-primary)]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {skill.items.map((item) => (
                  <span key={item} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-50 px-3 py-1.5 group-hover:border-[var(--color-primary)]/20 group-hover:text-[var(--color-primary)] transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

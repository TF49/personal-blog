import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ProjectShowcase() {
  const projects = [
    { title: '电商平台', category: '全栈开发', tech: 'Spring Boot, React', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800' },
    { title: 'AI 聊天仪表盘', category: '前端开发', tech: 'Next.js, OpenAI', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
    { title: 'DevOps 自动化', category: '基础设施', tech: 'Docker, Jenkins', image: 'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?auto=format&fit=crop&q=80&w=800' },
    { title: '移动健身应用', category: '移动端', tech: 'React Native', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] relative overflow-hidden">
      {/* 背景点状装饰 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-white/5 pb-12">
          <div className="md:w-1/2">
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-8 tracking-tighter">
              精选 <span className="text-[var(--color-primary)]">作品</span>
            </h2>
            <p className="text-white/40 text-xl font-light max-w-md">通过代码与设计突破界限，驱动 Web 开发的未来。</p>
          </div>
          <Link to="/blog" className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-[var(--color-primary)] transition-all group py-4 px-8 border border-white/10 hover:border-[var(--color-primary)]">
            查看全部案例 <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative aspect-[16/11] overflow-hidden bg-gray-900 cursor-pointer"
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-40 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <div className="overflow-hidden mb-4">
                  <div className="text-[var(--color-primary)] text-[10px] font-bold tracking-[0.5em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    {project.category}
                  </div>
                </div>
                <h3 className="text-white font-display text-3xl md:text-4xl mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <p className="text-white/60 text-sm font-medium tracking-wider">
                    {project.tech}
                  </p>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-all duration-300">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
              </div>
              
              {/* 装饰边角 */}
              <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/20 group-hover:border-[var(--color-primary)] transition-colors" />
              <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/20 group-hover:border-[var(--color-primary)] transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

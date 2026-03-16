import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white pt-40 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(circle_at_bottom_left,var(--color-primary),transparent_70%)] opacity-5 pointer-events-none" />
      
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-5xl tracking-tighter mb-10 block group">
              个人 <span className="text-[var(--color-primary)] group-hover:pl-2 transition-all duration-500">博客</span>
            </Link>
            <p className="text-white/40 text-xl max-w-md font-light leading-relaxed mb-12">
              一个受工业卓越和技术精密启发的高性能个人博客。驱动 Web 开发的未来。
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, name: 'Github' },
                { Icon: Twitter, name: 'Twitter' },
                { Icon: Linkedin, name: 'Linkedin' },
                { Icon: Mail, name: 'Mail' }
              ].map(({ Icon, name }, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  aria-label={name}
                  className="w-14 h-14 rounded-none border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-500 group"
                >
                  <Icon size={22} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-10">快速导航</h4>
            <ul className="space-y-6">
              {[
                { label: '首页', to: '/' },
                { label: '博客文章', to: '/blog' },
                { label: '关于作者', to: '/about' },
                { label: '技术项目', to: '/blog' },
                { label: '隐私政策', to: '#' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-[0.2em] font-medium block hover:translate-x-2 transition-transform duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-10">核心矩阵</h4>
            <ul className="space-y-6">
              {['React 生态', 'Spring 架构', '云原生部署', '全链路安全', '性能调优'].map((item) => (
                <li key={item} className="text-white/40 text-sm uppercase tracking-[0.2em] flex items-center gap-4 group cursor-default">
                  <div className="w-1.5 h-1.5 bg-[var(--color-primary)] group-hover:scale-150 transition-transform" />
                  <span className="group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} 个人博客. 保留所有权利。
            </p>
            <div className="h-4 w-px bg-white/5 hidden md:block" />
            <div className="flex gap-12 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-white transition-colors">Cookie 政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">系统运行正常</span>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

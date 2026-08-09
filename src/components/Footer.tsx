import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Magnet, ShinyText } from '@/components/reactbits'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-32 pb-12 border-t border-white/[0.08] relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-3xl tracking-tight mb-6 block group text-white">
              <ShinyText text="涂家乐" speed={5} /> <span className="text-white/40 font-light ml-1">Blog</span>
            </Link>
            <p className="text-white/40 text-sm max-w-sm font-light leading-relaxed mb-8">
              致力于打造极简、优雅且高品质的技术沉淀与博客空间。记录全栈开发、Linux 运维实践与思考。
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Github, name: 'Github' },
                { Icon: Twitter, name: 'Twitter' },
                { Icon: Linkedin, name: 'Linkedin' },
                { Icon: Mail, name: 'Mail' }
              ].map(({ Icon, name }, idx) => (
                <Magnet key={idx} strength={0.3}>
                  <a 
                    href="#" 
                    aria-label={name}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group block"
                  >
                    <Icon size={16} className="text-white/60 group-hover:text-white transition-colors" />
                  </a>
                </Magnet>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-white/80 tracking-wide mb-6">快速导航</h4>
            <ul className="space-y-4">
              {[
                { label: '首页', to: '/' },
                { label: '博客文章', to: '/blog' },
                { label: '关于作者', to: '/about' },
                { label: '技术项目', to: '/blog' },
                { label: '隐私政策', to: '#' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-white/55 hover:text-white transition-colors text-xs font-normal block transition-transform duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/80 tracking-wide mb-6">核心矩阵</h4>
            <ul className="space-y-4">
              {['React 生态', 'Spring 架构', '云原生部署', '全链路安全', '性能调优'].map((item) => (
                <li key={item} className="text-white/55 text-xs font-normal flex items-center gap-3 group cursor-default">
                  <div className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
                  <span className="group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-white/30 text-xs font-normal">
              © {new Date().getFullYear()} 涂家乐 Blog. 保留所有权利。
            </p>
            <div className="h-3 w-px bg-white/10 hidden md:block" />
            <div className="flex gap-6 text-white/30 text-xs font-normal">
              <a href="#" className="hover:text-white transition-colors">Cookie 政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-normal text-white/60">系统运行正常</span>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}


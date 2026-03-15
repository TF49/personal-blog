import { useEffect, useState, useRef, cloneElement, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { getStats, getHighlights, getTimeline, getRecentArticles } from '@/api'
import type { StatBlock, HighlightCard, TimelineEvent, Article } from '@/types'
import { ArrowRight, Zap, Shield, ZapOff, Cpu, Globe, Rocket, Layers, Code, Layout, Database, Share2, Award, Mail, Github, Twitter, Linkedin, ExternalLink, Terminal } from 'lucide-react'

function TechBentoGrid() {
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

function GlobalNetwork() {
  return (
    <section className="py-40 bg-[var(--color-black)] relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)]" />
      </div>

      <div className="container-narrow relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">全球连接可用</span>
          </div>
          <h2 className="font-display text-5xl sm:text-7xl text-white mb-10 tracking-tighter">
            连接 <span className="text-[var(--color-primary)]">万物</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['上海', '深圳', '杭州', '北京', '新加坡', '伦敦'].map((city) => (
              <span key={city} className="font-display text-xl md:text-2xl text-white/20 hover:text-white transition-colors duration-300">
                {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 动态数字背书跑马灯 */}
        <div className="mt-40 border-y border-white/5 py-12 overflow-hidden relative">
          <div className="marquee-content gap-20">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {['谷歌云', '微软 Azure', 'AWS 认证', 'Spring 专家', 'React 专家', 'Docker 专家'].map((brand) => (
                  <div key={brand} className="flex items-center gap-4 group">
                    <Award className="w-6 h-6 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
                    <span className="font-display text-2xl text-white/40 group-hover:text-white transition-colors">{brand}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Counter({ value, unit }: { value: string; unit: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return (
    <div ref={ref} className="font-display font-bold text-6xl sm:text-7xl lg:text-8xl text-[var(--color-primary)] leading-none tracking-tighter">
      {value.startsWith('+') ? '+' : ''}{count}{unit}
    </div>
  )
}

function TechDecomposition() {
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

function ProjectShowcase() {
  const projects = [
    { title: '电商平台', category: '全栈开发', tech: 'Spring Boot, React', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800' },
    { title: 'AI 聊天仪表盘', category: '前端开发', tech: 'Next.js, OpenAI', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
    { title: 'DevOps 自动化', category: '基础设施', tech: 'Docker, Jenkins', image: 'https://images.unsplash.com/photo-1605918321755-97520799ad05?auto=format&fit=crop&q=80&w=800' },
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

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, .cursor-pointer')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[var(--color-primary)] pointer-events-none z-[999] mix-blend-difference hidden md:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'rgba(196, 30, 58, 0.3)' : 'rgba(196, 30, 58, 0)'
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.5 }}
    />
  )
}

function InnovationPhilosophy() {
  const philosophyItems = [
    "永无止境的探索",
    "追求卓越工程",
    "以用户为中心",
    "面向未来的技术栈"
  ]

  return (
    <section className="py-24 bg-[var(--color-black)] overflow-hidden relative">
      <div className="container-wide px-6 lg:px-12 mb-6 md:mb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-5xl md:text-7xl text-white leading-none mb-4">
            创新 <br />
            <span className="text-[var(--color-primary)]">哲学</span>
          </h2>
        </motion.div>
      </div>
      
      <div className="relative flex items-center py-2 md:py-4 overflow-hidden border-y border-white/5">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 md:gap-24 pr-8 md:pr-24"
          >
            {[...philosophyItems, ...philosophyItems].map((text, idx) => (
              <span 
                key={idx}
                className="font-display text-4xl md:text-6xl lg:text-8xl text-white/5 tracking-tighter hover:text-[var(--color-primary)]/20 transition-colors duration-700 cursor-default select-none uppercase inline-block"
              >
                {text}
              </span>
            ))}
          </motion.div>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 md:gap-24 pr-8 md:pr-24"
          >
            {[...philosophyItems, ...philosophyItems].map((text, idx) => (
              <span 
                key={idx}
                className="font-display text-4xl md:text-6xl lg:text-8xl text-white/5 tracking-tighter hover:text-[var(--color-primary)]/20 transition-colors duration-700 cursor-default select-none uppercase inline-block"
              >
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-20 mt-6 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-white text-sm md:text-lg leading-relaxed font-light max-w-xl">
              我的哲学根植于这样一个信念：真正的创新源于对<span className="text-white font-medium border-b border-[var(--color-primary)]/50">卓越工程</span>的不懈追求和对人类体验的深刻理解。
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-white text-sm md:text-lg leading-relaxed font-light max-w-xl">
              每一行代码都是创造有意义、持久且强大事物的机会。我们不仅构建软件，我们更在<span className="text-[var(--color-primary)] font-medium">驱动无限可能</span>。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
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
              {[Github, Twitter, Linkedin, Mail].map((Icon, idx) => (
                <a key={idx} href="#" className="w-14 h-14 rounded-none border border-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-500 group">
                  <Icon size={22} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-10">快速导航</h4>
            <ul className="space-y-6">
              {['首页', '博客文章', '关于作者', '技术项目', '隐私政策'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-[0.2em] font-medium block hover:translate-x-2 transition-transform duration-300">{item}</Link>
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
              © 2024 个人博客. 保留所有权利。
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

function TechStackMarquee() {
  const techs = [
    { name: 'React', icon: <Code /> },
    { name: 'Spring Boot', icon: <Terminal /> },
    { name: 'Next.js', icon: <Layers /> },
    { name: 'Tailwind', icon: <Layout /> },
    { name: 'Docker', icon: <Database /> },
    { name: 'TypeScript', icon: <Cpu /> },
    { name: 'Kubernetes', icon: <Share2 /> },
    { name: 'Framer Motion', icon: <Zap /> }
  ]

  return (
    <section className="py-24 bg-[var(--color-black)] overflow-hidden border-y border-white/5 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      <div className="flex flex-col gap-16 relative z-10">
        <div className="flex marquee-content gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {techs.map((tech) => (
                <div key={tech.name} className="flex flex-col items-center justify-center w-40 h-40 bg-white/[0.02] border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-700 group cursor-default">
                  <div className="text-[var(--color-primary)] group-hover:scale-125 transition-transform duration-500 mb-4 opacity-50 group-hover:opacity-100">
                    {cloneElement(tech.icon as ReactElement, { size: 32 })}
                  </div>
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex marquee-content-reverse gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {techs.slice().reverse().map((tech) => (
                <div key={tech.name} className="flex flex-col items-center justify-center w-40 h-40 bg-white/[0.02] border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-700 group cursor-default">
                  <div className="text-[var(--color-primary)] group-hover:scale-125 transition-transform duration-500 mb-4 opacity-50 group-hover:opacity-100">
                    {cloneElement(tech.icon as ReactElement, { size: 32 })}
                  </div>
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const faqs = [
    { q: "你的主要开发技术栈是什么？", a: "我专注于“强力技术栈”：使用 Spring Boot 构建稳健的后端，使用 React/Next.js 打造高性能的前端界面。" },
    { q: "你如何确保应用的性能？", a: "通过严格的优化、缓存策略和受高端制造业启发的工业级工程实践来确保卓越性能。" },
    { q: "你接受全球范围的合作吗？", a: "当然。我具备全球化协作能力，能够跨越不同时区和文化与技术领域进行连接。" }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-8">
              常见问题 <br />
              <span className="text-[var(--color-primary)]">解答</span>
            </h2>
            <p className="text-[var(--color-muted)] text-lg font-light">深入了解我的技术方法论和职业哲学。</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-accordion-item border-b border-gray-100 pb-6 cursor-pointer ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              >
                <div className="flex justify-between items-center group">
                  <h3 className={`font-display text-xl transition-colors ${activeIndex === idx ? 'text-[var(--color-primary)]' : 'text-[var(--color-black)] group-hover:text-[var(--color-primary)]'}`}>
                    {faq.q}
                  </h3>
                  <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-500 ${activeIndex === idx ? 'rotate-180 bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : ''}`}>
                    <ArrowRight size={16} className="rotate-90" />
                  </div>
                </div>
                <div className="faq-accordion-content">
                  <p className="pt-6 text-[var(--color-muted)] leading-relaxed font-light text-lg">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MilestoneProgress() {
  const milestones = [
    { year: '2024', title: '全球拓展', desc: '将技术触角延伸至国际领域，开启全球化协作。' },
    { year: '2023', title: '工业级标准', desc: '在核心开发中采用高精度工程标准和规范。' },
    { year: '2022', title: '基础构建', desc: '深钻全栈架构和微服务，打下坚实的技术基础。' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      <div className="container-narrow relative z-10">
        <div className="mb-20 text-center">
          <h2 className="font-display text-4xl sm:text-6xl mb-6">
            发展 <span className="text-[var(--color-primary)]">里程碑</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto" />
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:left-1/2">
          {milestones.map((m, idx) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-24 last:mb-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-20 md:-translate-x-full text-right' : 'md:pl-20'}`}
            >
              <div className="absolute top-0 w-8 h-8 bg-[var(--color-black)] border-4 border-[var(--color-primary)] rounded-full -left-4 md:left-auto md:right-0 md:translate-x-1/2 shadow-[0_0_20px_rgba(196,30,58,0.5)]" />
              <div className="font-display text-4xl text-[var(--color-primary)] mb-2">{m.year}</div>
              <h3 className="font-display text-2xl mb-4 text-white uppercase tracking-widest">{m.title}</h3>
              <p className="text-white/40 text-lg font-light leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillMastery() {
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

function InteractiveLab() {
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
              <p className="text-white/60 text-lg leading-relaxed mb-12 font-light italic">
                "{demos[activeTab as keyof typeof demos].desc}"
              </p>
              <div className="grid grid-cols-3 gap-8">
                {demos[activeTab as keyof typeof demos].metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{m.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full aspect-square bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent p-1 border border-white/5 relative group">
              <div className="absolute inset-0 bg-white/5 opacity-50 group-hover:opacity-30 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* 装饰性仪表盘动效 */}
                <div className="w-64 h-64 border-4 border-dashed border-[var(--color-primary)]/20 rounded-full animate-spin-slow" />
                <div className="absolute w-48 h-48 border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-display text-[var(--color-primary)] animate-pulse">
                      {activeTab === 'performance' && '45ms'}
                      {activeTab === 'security' && 'AES'}
                      {activeTab === 'scalability' && 'X24'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DevWorkflow() {
  const steps = [
    { phase: '阶段 01', title: '深度挖掘', desc: '以工业级精度分析需求，识别核心技术挑战。', status: '已完成' },
    { phase: '阶段 02', title: '系统蓝图', desc: '使用现代设计模式架构稳健、可扩展的解决方案。', status: '进行中' },
    { phase: '阶段 03', title: '精密构建', desc: '通过持续集成和测试，编写整洁、可维护的代码。', status: '待定' },
    { phase: '阶段 04', title: '质量锁定', desc: '严格的性能调优和安全审计，确保任务关键型的稳定性。', status: '待定' }
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="md:w-1/2">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-6">
              开发 <br />
              <span className="text-[var(--color-primary)]">工作流</span>
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-[var(--color-muted)] text-xl font-light leading-relaxed">
              我们的工程过程是高端制造原则与敏捷软件开发的融合。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="font-display text-xs uppercase tracking-[0.4em] text-[var(--color-primary)] mb-6 flex items-center gap-4">
                {step.phase}
                <div className="h-px flex-1 bg-[var(--color-primary)]/20" />
              </div>
              <h3 className="font-display text-2xl text-[var(--color-black)] mb-6 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[var(--color-muted)] font-light leading-relaxed mb-8">
                {step.desc}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100">
                <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'COMPLETED' ? 'bg-green-500' : step.status === 'IN PROGRESS' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechRadar() {
  const categories = [
    { name: '编程语言', items: ['Java', 'TypeScript', 'SQL', 'Python'] },
    { name: '框架', items: ['Spring Boot', 'React', 'Next.js', 'Express'] },
    { name: '基础设施', items: ['Docker', 'Kubernetes', 'AWS', 'Linux'] },
    { name: '工具', items: ['Git', 'Jenkins', 'Postman', 'Vite'] }
  ]

  return (
    <section className="py-40 bg-[var(--color-black)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_49px,white_50px)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,white_50px)]" />
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="text-center mb-32">
          <h2 className="font-display text-4xl sm:text-7xl text-white mb-8">
            技术 <span className="text-[var(--color-primary)]">雷达</span>
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.5em]">当前技术导向</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-12 inline-block">
                <div className="w-32 h-32 border border-[var(--color-primary)]/30 rounded-full flex items-center justify-center relative">
                  <div className="w-24 h-24 border border-[var(--color-primary)]/50 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full animate-pulse opacity-20" />
                  </div>
                  <div className="absolute inset-0 border-t border-r border-[var(--color-primary)] rounded-full animate-spin-slow" />
                </div>
                <h4 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[10px] tracking-[0.3em] text-[var(--color-primary)]">
                  {cat.name}
                </h4>
              </div>
              <div className="space-y-4">
                {cat.items.map((item) => (
                  <div key={item} className="text-white/60 hover:text-white transition-colors cursor-default text-lg font-light tracking-wide">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExplodedTechView() {
  const parts = [
    { id: 'ui', title: '用户界面', offset: -150, icon: <Layout />, desc: '通过 Framer Motion 编排的原子设计系统。' },
    { id: 'logic', title: '业务逻辑', offset: -50, icon: <Cpu />, desc: '使用 React Hooks 的类型安全函数式编程。' },
    { id: 'data', title: '数据流', offset: 50, icon: <Database />, desc: '通过 WebSocket 和 REST 实现实时同步。' },
    { id: 'infra', title: '基础设施', offset: 150, icon: <Share2 />, desc: 'Kubernetes 集群上的 Docker 化微服务。' }
  ]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white overflow-hidden perspective-1000">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="mb-32 text-center">
          <h2 className="font-display text-4xl sm:text-7xl mb-8">
            爆炸式 <span className="text-[var(--color-primary)]">架构</span>
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-[0.5em]">模块化核心解构</p>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
          {parts.map((part, idx) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, z: part.offset }}
              whileInView={{ opacity: 1, z: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 1 }}
              className="absolute w-full max-w-xl group preserve-3d cursor-pointer"
              style={{ transform: `translateZ(${part.offset}px)` }}
            >
              <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-xl hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-500">
                <div className="flex items-center gap-8">
                  <div className="text-[var(--color-primary)] p-4 bg-black/50 border border-white/5">
                    {part.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl mb-2">{part.title}</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/80 transition-colors">
                      {part.desc}
                    </p>
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

function PerformanceDashboard() {
  const metrics = [
    { label: '系统在线率', value: '99.9', unit: '%' },
    { label: '响应时间', value: '42', unit: 'ms' },
    { label: '安全等级', value: 'A+', unit: '' },
    { label: '负载能力', value: '10k', unit: 'qps' }
  ]

  return (
    <section className="py-32 bg-white border-y border-gray-100">
      <div className="container-wide px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] mb-4">
                {m.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl lg:text-7xl text-[var(--color-black)] tracking-tighter">
                  {m.value}
                </span>
                <span className="font-display text-xl text-[var(--color-muted)]">{m.unit}</span>
              </div>
              <div className="mt-6 h-px w-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '0%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                  className="h-full bg-[var(--color-primary)]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechnicalWhitepaper() {
  const papers = [
    { title: '高性能后端扩展指南', code: 'WP-2024-01', size: '2.4 MB', tag: '架构设计' },
    { title: '现代前端编排艺术', code: 'WP-2024-02', size: '1.8 MB', tag: 'UI/UX 设计' },
    { title: '工业级安全协议实践', code: 'WP-2024-03', size: '3.1 MB', tag: '系统安全' }
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="lg:w-1/2">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-6">
              技术 <br />
              <span className="text-[var(--color-primary)]">白皮书</span>
            </h2>
            <p className="text-[var(--color-muted)] text-xl font-light leading-relaxed">
              深入探讨卓越工程与工业化标准。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {papers.map((paper, idx) => (
            <motion.div
              key={paper.code}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row items-center justify-between p-8 border border-gray-100 hover:border-[var(--color-primary)] hover:bg-gray-50 transition-all duration-500 cursor-pointer"
            >
              <div className="flex items-center gap-8 mb-6 md:mb-0">
                <div className="font-display text-xs text-[var(--color-primary)] px-3 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                  {paper.code}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[var(--color-black)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {paper.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{paper.tag}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{paper.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none border border-gray-200 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IndustryNews() {
  const news = [
    { date: '2024年10月12日', title: '通过混沌工程提升分布式系统可靠性', category: '系统架构', summary: '探讨如何在复杂分布式系统中引入受控故障，以验证系统的自我修复能力。' },
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

export default function Home() {
  const [stats, setStats] = useState<StatBlock[]>([])
  const [highlights, setHighlights] = useState<HighlightCard[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    setStats(getStats())
    setHighlights(getHighlights())
    setTimeline(getTimeline())
    getRecentArticles(6).then(setArticles)
  }, [])

  return (
    <>
      {/* 滚动进度条 */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-[var(--color-primary)] z-[100] origin-left"
        style={{ width: progressWidth }}
      />

      <CustomCursor />

      {/* Hero - 全屏冲击力个人博客 */}
      <section className="relative min-h-screen flex flex-col justify-center items-center bg-[var(--color-black)] overflow-hidden">
        {/* 背景装饰：增强的能量场感 */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--color-primary)] rounded-full blur-[160px]" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] text-white tracking-tighter leading-none mb-8">
              No.1
            </h1>
            <div className="space-y-2">
              <p className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight font-extralight uppercase">
                持久充满能量的
              </p>
              <p className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--color-primary)] tracking-tight font-bold uppercase">
                个人博客
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/blog" className="btn-primary group text-lg px-12 py-5">
              探索能量中心
              <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link to="/about" className="text-white/40 hover:text-white transition-colors tracking-[0.3em] text-xs font-bold uppercase py-5 px-8 border border-white/10 hover:border-white/30">
              品牌故事
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-[-100px] left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">向下滚动探索更多</span>
              <div className="w-px h-12 bg-gradient-to-b from-[var(--color-primary)] to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3 Reasons - 工业级卡片展示 */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-narrow relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-3xl sm:text-5xl text-[var(--color-black)]">
              选择我的 <span className="text-[var(--color-primary)]">3 个理由</span>
            </h2>
            <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-100 shadow-2xl">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-12 lg:p-16 bg-white border-r last:border-r-0 border-gray-100 hover:bg-[var(--color-black)] transition-all duration-700 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-[var(--color-primary)] group-hover:h-full transition-all duration-700" />
                <div className="text-[var(--color-primary)] mb-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                  {i === 0 && <Zap size={48} strokeWidth={1} />}
                  {i === 1 && <Shield size={48} strokeWidth={1} />}
                  {i === 2 && <ZapOff size={48} strokeWidth={1} />}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-[var(--color-black)] group-hover:text-white transition-colors duration-500">
                  {h.title}
                </h3>
                <p className="mt-3 text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em]">
                  {h.subtitle}
                </p>
                <p className="mt-8 text-[var(--color-muted)] group-hover:text-white/60 text-base leading-relaxed transition-colors duration-500 font-light">
                  {h.description}
                </p>
                <div className="mt-10 flex items-center gap-2 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest">探索详情</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 新增：技术深度解析板块 */}
      <TechDecomposition />

      {/* 项目展示区 */}
      <ProjectShowcase />

      {/* 品牌哲学滚动板块 */}
      <InnovationPhilosophy />

      {/* 技术栈双向跑马灯 */}
      <TechStackMarquee />

      {/* 技术生态 Bento Grid */}
      <TechBentoGrid />

      {/* 技能热图与熟练度 */}
      <SkillMastery />

      {/* 技术雷达扫描 */}
      <TechRadar />

      {/* 实时性能指标仪表盘 */}
      <PerformanceDashboard />

      {/* 工业技术资讯动态网格 */}
      <IndustryNews />

      {/* 核心技术爆炸拆解 */}
      <ExplodedTechView />

      {/* 工业白皮书下载 */}
      <TechnicalWhitepaper />

      {/* 交互式项目演示实验室 */}
      <InteractiveLab />

      {/* 开发流程图 */}
      <DevWorkflow />

      {/* 工业里程碑 */}
      <MilestoneProgress />

      {/* 全球连接与跑马灯 */}
      <GlobalNetwork />

      {/* 技术 FAQ */}
      <TechFAQ />

      {/* 大数字动效区 */}
      <section className="py-32 bg-[var(--color-surface)]">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <Counter value={s.value} unit={s.unit ?? ''} />
                <p className="mt-6 text-[var(--color-black)] font-bold text-xs uppercase tracking-[0.2em] opacity-60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Power Ring - 能量环交互 */}
      <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
        {/* 背景动效 */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border-[1px] border-[var(--color-primary)] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[1px] border-white/10 rounded-full animate-spin-slow" />
        </div>

        <div className="container-narrow relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl sm:text-6xl mb-6">
              独特 <span className="text-[var(--color-primary)]">能量环</span>
            </h2>
            <p className="text-white/40 text-xs uppercase tracking-[0.4em]">核心能力展示</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { title: '超强容量', sub: '极致外壳设计', desc: '在 Spring Boot、React 和云原生环境中的全栈开发能力。' },
              { title: '卓越续航', sub: '持久动力支持', desc: '持续输出高质量技术笔记，保持稳定的学习习惯。' },
              { title: '超低自耗', sub: '锁定核心动力', desc: '专注于整洁代码、Git 工作流和专业工程标准。' }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center group"
              >
                <div className="font-display text-4xl lg:text-5xl text-[var(--color-primary)] mb-4 transition-transform group-hover:scale-105 duration-500">
                  {item.title}
                </div>
                <div className="text-[10px] font-bold tracking-[0.3em] text-white/30 mb-6">{item.sub}</div>
                <p className="text-white/60 text-sm leading-loose max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline - 简约工业风 */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row gap-16 lg:gap-32">
            <div className="md:w-1/3">
              <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-black)] leading-tight">
                不断进取的 <br />
                <span className="text-[var(--color-primary)]">历程</span>
              </h2>
              <p className="mt-8 text-[var(--color-muted)] text-sm leading-relaxed">
                一段从学术学习到实际工程卓越的旅程。
              </p>
            </div>
            <div className="md:w-2/3 border-l border-gray-100 pl-12 space-y-16">
              {timeline.map((e) => (
                <motion.div 
                  key={e.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[53px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
                  <span className="font-display text-2xl text-[var(--color-primary)] block mb-2">{e.year}</span>
                  <h4 className="font-display text-xl text-[var(--color-black)] mb-4">{e.title}</h4>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">{e.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles - 杂志感布局 */}
      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-wide px-6 lg:px-12">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-display text-3xl sm:text-5xl text-[var(--color-black)]">最近文章</h2>
              <p className="mt-4 text-[var(--color-muted)] text-xs uppercase tracking-widest">技术笔记与感悟</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-black)] hover:text-[var(--color-primary)] transition-colors group">
              查看全部 <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${a.slug}`}
                  className="block group h-full bg-white p-10 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-6">
                    {a.category}
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-black)] group-hover:text-[var(--color-primary)] transition-colors duration-300 line-clamp-2 leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-6 text-sm text-[var(--color-muted)] line-clamp-2 leading-loose">
                    {a.summary}
                  </p>
                  <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{a.date}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Final Impact */}
      <section className="py-64 bg-[var(--color-primary)] text-white text-center relative overflow-hidden">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-10" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="container-narrow relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl mb-12 tracking-tighter leading-none">
              准备好 <br />开启新能量吗？
            </h2>
            <p className="text-white/80 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              探索受工业卓越启发的 Web 未来。欢迎技术协作、深度交流以及对极致性能的追求。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/about" className="btn-dark px-16 py-6 group flex items-center gap-6 text-lg">
                即刻开启协作 <ExternalLink size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </Link>
              <Link to="/blog" className="text-white/60 hover:text-white transition-colors tracking-[0.4em] text-xs font-bold uppercase py-6 px-12 border border-white/20 hover:border-white">
                浏览技术文档
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* 底部装饰条 */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10" />
      </section>

      <Footer />
    </>
  )
}

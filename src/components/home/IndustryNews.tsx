import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/types'

type IndustryNewsProps = {
  articles?: Article[]
}

export default function IndustryNews({ articles }: IndustryNewsProps) {
  const items = (articles ?? []).slice(0, 3)

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      {/* 装饰性光晕 */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_70%)] opacity-10" />
      
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-32 border-b border-white/10 pb-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-8 tracking-tighter">内容 <span className="text-[var(--color-primary)]">更新</span></h2>
            <p className="text-white/40 text-xl font-light">来自博客内容源的最近更新（GitHub Issues → articles.json）。</p>
          </div>
          <Link to="/blog" className="mt-12 md:mt-0 flex items-center text-[10px] font-bold uppercase tracking-[0.5em] hover:text-[var(--color-primary)] transition-all group py-4 px-8 border border-white/10 hover:border-[var(--color-primary)] whitespace-nowrap">
            探索全部深度文章 <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-white/40 text-sm font-light">
            暂无文章数据。请先运行 <span className="font-mono">npm run generate:articles</span> 生成 <span className="font-mono">public/articles.json</span>。
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:divide-x divide-white/10">
            {items.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="lg:pl-16 first:pl-0 group"
              >
                <Link to={`/blog/${a.slug}`} className="block">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-px bg-[var(--color-primary)]" />
                    <div className="text-[var(--color-primary)] font-display text-xs tracking-[0.4em] uppercase">
                      {a.date}
                    </div>
                  </div>
                  
                  <h3 className="font-display text-3xl mb-8 group-hover:text-[var(--color-primary)] transition-colors leading-tight min-h-[4rem]">
                    {a.title}
                  </h3>
                  
                  <p className="text-white/40 text-lg font-light leading-relaxed mb-10 line-clamp-3 group-hover:text-white/60 transition-colors">
                    {a.summary}
                  </p>
                  
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 group-hover:border-[var(--color-primary)]/40 group-hover:bg-[var(--color-primary)]/5 transition-all">
                    <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-[var(--color-primary)]">{a.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

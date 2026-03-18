import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Article } from '@/types'

type TechnicalWhitepaperProps = {
  articles?: Article[]
}

function codeFromArticle(a: Article, idx: number) {
  const day = String(a.date ?? '').replace(/-/g, '') || '00000000'
  return `FT-${day}-${String(idx + 1).padStart(2, '0')}`
}

export default function TechnicalWhitepaper({ articles }: TechnicalWhitepaperProps) {
  const items = (articles ?? []).slice(0, 3)

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="lg:w-1/2">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-6">
              技术 <br />
              <span className="text-[var(--color-primary)]">精选长文</span>
            </h2>
            <p className="text-[var(--color-muted)] text-xl font-light leading-relaxed">
              从已发布文章中挑选的高信号内容（按评论数/热度与更新综合）。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-[var(--color-muted)] text-sm font-light">
              暂无可展示文章。请先生成 <span className="font-mono">articles.json</span>。
            </div>
          ) : null}
          {items.map((a, idx) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row items-center justify-between p-8 border border-gray-100 hover:border-[var(--color-primary)] hover:bg-gray-50 transition-all duration-500"
            >
              <Link to={`/blog/${a.slug}`} className="flex flex-1 items-center gap-8 mb-6 md:mb-0 min-w-0">
                <div className="font-display text-xs text-[var(--color-primary)] px-3 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 shrink-0">
                  {codeFromArticle(a, idx)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-[var(--color-black)] mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{a.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{a.date}</span>
                  </div>
                </div>
              </Link>
              <Link to={`/blog/${a.slug}`} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none border border-gray-200 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

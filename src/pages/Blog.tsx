import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getArticles, getRecommendedArticles } from '@/api'
import { profile } from '@/data/profile'
import type { Article } from '@/types'
import { ArrowRight, Search, Tag, User } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const all = await getArticles()
      if (cancelled) return
      setArticles(all)
      setCategories(Array.from(new Set(all.map((a) => a.category))))
      document.dispatchEvent(new Event('prerender-ready'))
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    getRecommendedArticles({ currentCategory: filter ?? undefined, limit: 3 }).then(setRecommendedArticles)
  }, [filter])

  const q = query.trim().toLowerCase()
  const filtered = articles.filter((a) => {
    if (filter && a.category !== filter) return false
    if (!q) return true
    const haystack = `${a.title} ${a.summary}`.toLowerCase()
    return haystack.includes(q)
  })

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="博客"
        description="博客文章列表：开发笔记、项目总结与随笔。"
      />
      {/* 博客头部 - 工业极简风 */}
      <section className="pt-40 pb-20 bg-[var(--color-black)] text-white overflow-hidden relative">
        <div className="container-narrow relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">思想库与技术简报</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-6 tracking-tighter">
              内容 <span className="text-[var(--color-primary)]">发布</span>
            </h1>
            <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
              深度解析开发笔记、生活随笔与前沿项目总结。
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
      </section>

      {/* 分类导航条 */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-100 py-6">
        <div className="container-narrow flex items-center justify-between gap-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter(null)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                filter === null 
                  ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' 
                  : 'bg-[var(--color-surface)] text-gray-400 hover:bg-gray-100'
              }`}
            >
              全部内容
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  filter === cat 
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' 
                    : 'bg-[var(--color-surface)] text-gray-400 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-[var(--color-surface)] border border-gray-100">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章..."
              className="bg-transparent border-none outline-none text-xs text-[var(--color-black)] w-40"
            />
          </div>
        </div>
      </section>

      <div className="container-narrow py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* 主列表区 */}
          <div className="lg:col-span-8 space-y-12">
            {filtered.length === 0 ? (
              <div className="py-24 text-center text-[var(--color-muted)]">
                <div className="font-display text-xs uppercase tracking-widest">没有匹配的文章</div>
                <div className="mt-3 text-sm font-light">试试更换分类或搜索关键词</div>
              </div>
            ) : (
              filtered.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/blog/${a.slug}`}
                  className="group block"
                >
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-full md:w-1/3 aspect-[4/3] bg-[var(--color-surface)] overflow-hidden relative border border-gray-100">
                      <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/10 transition-colors duration-500 z-10" />
                      <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white shadow-sm text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        {a.category}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[var(--color-primary)] font-display text-xs tracking-[0.3em] mb-4">
                        {a.date}
                      </div>
                      <h2 className="font-display text-3xl text-[var(--color-black)] mb-6 group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-snug">
                        {a.title}
                      </h2>
                      <p className="text-[var(--color-muted)] text-lg font-light leading-relaxed mb-8 line-clamp-3">
                        {a.summary}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span>评论数 {a.readCount ?? 0}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span className="group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
                          阅读全文 <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
            )}
          </div>

          {/* 侧边栏 - 工业风组件 */}
          <aside className="lg:col-span-4 space-y-16">
            <div className="p-10 bg-[var(--color-surface)] border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <User size={20} className="text-[var(--color-primary)]" />
                <h3 className="font-display text-xs uppercase tracking-[0.3em] text-[var(--color-black)]">发布者信息</h3>
              </div>
              <p className="font-display text-2xl text-[var(--color-black)] mb-4">{profile.name}</p>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed mb-8">{profile.title}</p>
              <Link to="/about" className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2 hover:gap-4 transition-all">
                详细档案 <ArrowRight size={12} />
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-10">
                <Tag size={20} className="text-[var(--color-primary)]" />
                <h3 className="font-display text-xs uppercase tracking-[0.3em] text-[var(--color-black)]">推荐阅读</h3>
              </div>
              <div className="space-y-8">
                {recommendedArticles.map((a) => (
                  <Link key={a.id} to={`/blog/${a.slug}`} className="group block">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {a.category}
                    </div>
                    <h4 className="font-display text-lg text-[var(--color-black)] leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                      {a.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

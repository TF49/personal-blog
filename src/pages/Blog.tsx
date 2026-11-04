import { useEffect, useState } from 'react'
import { getArticles } from '@/api'
import type { Article } from '@/types'
import SEO from '@/components/SEO'
import ToneSection from '@/components/site/ToneSection'
import SectionLabel from '@/components/site/SectionLabel'
import FilterBar from '@/components/site/FilterBar'
import PostIndex from '@/components/site/PostIndex'

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filter, setFilter] = useState<string | null>(null)

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

  const filtered = articles.filter((a) => {
    if (filter && a.category !== filter) return false
    return true
  })

  return (
    <ToneSection tone="ink" as="div" className="min-h-screen pt-[64px]">
      <SEO
        title="博客"
        description="博客文章列表：开发笔记、项目总结与随笔"
      />

      {/* Page header */}
      <ToneSection tone="ink" as="section" className="pt-24 pb-16 site-wrap">
        <SectionLabel label="POSTS" />
        <h1 className="text-h1 mt-8 font-medium">文章</h1>
      </ToneSection>

      {/* Filter bar */}
      <div className="site-wrap pb-8">
        <FilterBar
          categories={categories}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {/* Article list */}
      <div className="site-wrap pb-32">
        <PostIndex articles={filtered} />
        {filtered.length === 0 && articles.length > 0 && (
          <p className="text-body text-fg-muted py-16 text-center">没有匹配的文章</p>
        )}
        {articles.length === 0 && (
          <p className="text-body text-fg-muted py-16 text-center">加载中…</p>
        )}
      </div>
    </ToneSection>
  )
}

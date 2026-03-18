import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getArticleBySlug, getArticles } from '@/api'
import type { Article } from '@/types'
import { ArrowLeft, Clock, Eye, Share2, Bookmark } from 'lucide-react'
import { getShareUrl, shareOrCopy } from '@/utils/share'
import { useToast } from '@/components/toast/ToastProvider'
import SEO from '@/components/SEO'
import DOMPurify from 'dompurify'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Article | null | undefined>(undefined)
  const [related, setRelated] = useState<Article[]>([])
  const [shareBusy, setShareBusy] = useState(false)
  const toast = useToast()

  const shareUrl = useMemo(() => getShareUrl(), [slug])

  useEffect(() => {
    if (!slug) return
    setPost(undefined)
    setRelated([])
    getArticleBySlug(slug).then((p) => {
      setPost(p)
      if (p) {
        getArticles().then((all) => {
          const others = all.filter((a) => a.id !== p.id).slice(0, 3)
          setRelated(others)
        })
      }
      document.dispatchEvent(new Event('prerender-ready'))
    })
    window.scrollTo(0, 0)
  }, [slug])

  if (!slug) return null
  if (post === undefined) {
    return (
      <div className="section-padding text-center text-[var(--color-muted)] bg-white min-h-screen flex items-center justify-center font-display uppercase tracking-widest text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          正在同步内容数据...
        </div>
      </div>
    )
  }
  if (post === null) {
    return (
      <div className="section-padding text-center bg-white min-h-screen flex flex-col items-center justify-center">
        <SEO title="文章不存在" description="你访问的文章不存在或已被移除。" noindex />
        <h1 className="font-display text-9xl text-gray-100 mb-8">404</h1>
        <p className="text-[var(--color-muted)] text-xl font-light mb-12">抱歉，您请求的档案不存在或已被移除。</p>
        <Link to="/blog" className="btn-primary">返回博客矩阵</Link>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
  }

  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(post.content, {
      USE_PROFILES: { html: true },
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/)/i,
    })
  }, [post.content])

  return (
    <div className="bg-white min-h-screen pt-24">
      <SEO title={post.title} description={post.summary} jsonLd={jsonLd} />
      {/* 进度条 */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-[var(--color-primary)] z-[100] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="container-narrow max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link
            to="/blog"
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-12 hover:gap-4 transition-all"
          >
            <ArrowLeft size={14} /> 返回博客列表
          </Link>

          <header className="mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-8">
              <Bookmark size={10} /> {post.category}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[var(--color-black)] mb-10 tracking-tighter leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-y border-gray-100 py-6">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--color-primary)]" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-[var(--color-primary)]" />
                <span>评论数 {post.readCount ?? 0}</span>
              </div>
              <div className="ml-auto flex gap-4">
                <button
                  type="button"
                  aria-label="分享"
                  disabled={shareBusy}
                  className={`transition-colors ${shareBusy ? 'opacity-50 cursor-not-allowed' : 'hover:text-[var(--color-primary)]'}`}
                  onClick={async () => {
                    if (shareBusy) return
                    setShareBusy(true)
                    try {
                      const res = await shareOrCopy({
                        title: post.title,
                        url: shareUrl,
                      })
                      if (res.kind === 'copied') toast.success('已复制文章链接')
                    } catch {
                      toast.error('分享失败，请重试')
                    } finally {
                      window.setTimeout(() => setShareBusy(false), 800)
                    }
                  }}
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </header>

          <div
            className="article-content prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tighter prose-p:text-gray-600 prose-p:leading-loose prose-a:text-[var(--color-primary)] prose-img:border prose-img:border-gray-100"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          {/* 相关推荐 - 工业风卡片 */}
          {related.length > 0 && (
            <section className="mt-32 pt-20 border-t border-gray-100">
              <div className="flex items-end justify-between mb-12">
                <h2 className="font-display text-3xl text-[var(--color-black)] tracking-tighter">
                  相关 <span className="text-[var(--color-primary)]">推荐</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((a) => (
                  <Link
                    key={a.id}
                    to={`/blog/${a.slug}`}
                    className="group block p-8 bg-[var(--color-surface)] border border-gray-100 hover:border-[var(--color-primary)] transition-all duration-500"
                  >
                    <div className="text-[var(--color-primary)] font-display text-[10px] tracking-widest mb-4 uppercase">
                      {a.category}
                    </div>
                    <h3 className="font-display text-lg text-[var(--color-black)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug">
                      {a.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  )
}

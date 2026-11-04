import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { getArticleBySlug, getArticles } from '@/api'
import type { Article } from '@/types'
import { getShareUrl, shareOrCopy } from '@/utils/share'
import { useToast } from '@/components/toast/ToastProvider'
import SEO from '@/components/SEO'
import DOMPurify from 'dompurify'
import ToneSection from '@/components/site/ToneSection'
import SectionLabel from '@/components/site/SectionLabel'
import TagPill from '@/components/site/TagPill'
import ArticleBody from '@/components/site/ArticleBody'
import { ICON_SM } from '@/components/site/icon'

function readingTime(html: string): string {
  // Strip tags to get plain text, ~350 chars/min for Chinese
  const text = html.replace(/<[^>]*>/g, '').trim()
  const mins = Math.max(1, Math.round(text.length / 350))
  return `约 ${mins} 分钟`
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Article | null | undefined>(undefined)
  const [related, setRelated] = useState<Article[]>([])
  const [shareBusy, setShareBusy] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const toast = useToast()
  const articleRef = useRef<HTMLDivElement>(null)

  const toPostPath = (s: string) => `/blog/${encodeURIComponent(s)}`

  const shareUrl = useMemo(() => getShareUrl(), [slug])

  const postContent = post && typeof post.content === 'string' ? post.content : ''
  const safeHtml = useMemo(() => {
    // eslint-disable-next-line no-useless-escape
    const URI_RE = /^(?:(?:https?|mailto):|\/)/ as unknown as RegExp
    return DOMPurify.sanitize(postContent, {
      USE_PROFILES: { html: true },
      ALLOWED_URI_REGEXP: URI_RE,
    })
  }, [postContent])

  const jsonLd = useMemo(() => {
    if (!post) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      dateModified: post.date,
    }
  }, [post])

  const estReadingTime = useMemo(() => readingTime(safeHtml), [safeHtml])

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

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      setScrollProgress(scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Inject copy code buttons in article after content loads
  useEffect(() => {
    if (!post || !articleRef.current) return
    const preBlocks = articleRef.current.querySelectorAll('pre')
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.innerText = 'Copy'
      btn.type = 'button'
      btn.onclick = async () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText
        try {
          await navigator.clipboard.writeText(code)
          btn.innerText = 'Copied!'
          toast.success('已复制代码段')
          setTimeout(() => {
            btn.innerText = 'Copy'
          }, 2000)
        } catch {
          toast.error('复制失败')
        }
      }
      pre.appendChild(btn)
    })
  }, [post, safeHtml])

  if (!slug) return null

  if (post === undefined) {
    return (
      <ToneSection tone="ink" as="div" className="min-h-screen pt-[64px] flex items-center justify-center">
        <p className="text-label text-fg-muted uppercase tracking-widest">加载中…</p>
      </ToneSection>
    )
  }

  if (post === null) {
    return (
      <ToneSection tone="ink" as="div" className="min-h-screen pt-[64px] flex flex-col items-center justify-center">
        <SEO title="文章不存在" description="你访问的文章不存在或已被移除。" noindex />
        <h1 className="text-display font-medium text-fg-muted mb-8">404</h1>
        <p className="text-body text-fg-muted mb-12">抱歉，您请求的文章不存在或已被移除。</p>
        <Link to="/blog" className="text-label border border-line px-6 py-3 rounded-pill hover:border-fg transition-colors">
          返回文章列表
        </Link>
      </ToneSection>
    )
  }

  return (
    <ToneSection tone="ink" as="div" className="min-h-screen pt-[64px]">
      <SEO title={post.title} description={post.summary} jsonLd={jsonLd} />

      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-fg z-[100] origin-left transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      />

      {/* Back link */}
      <div className="site-wrap pt-12 pb-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-label text-fg-muted hover:text-fg transition-colors"
        >
          <ArrowLeftIcon {...ICON_SM} />
          文章列表
        </Link>
      </div>

      {/* Article header */}
      <ToneSection tone="ink" as="header" className="site-wrap pb-16">
        <SectionLabel label="ARTICLE" />
        <TagPill label={post.category} />
        <h1 className="text-h1 font-medium mt-6 max-w-article">{post.title}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-label text-fg-muted border-t border-line pt-6">
          <time dateTime={post.date}>{post.date}</time>
          {post.readCount !== undefined && (
            <span>评论 {post.readCount}</span>
          )}
          <span>{estReadingTime}</span>
          <div className="ml-auto">
            <button
              type="button"
              aria-label="分享文章"
              disabled={shareBusy}
              className={[
                'inline-flex items-center gap-2 text-label border border-line rounded-pill px-4 py-1.5',
                'hover:border-fg hover:text-fg transition-colors',
                shareBusy ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
              onClick={async () => {
                if (shareBusy) return
                setShareBusy(true)
                try {
                  const res = await shareOrCopy({ title: post.title, url: shareUrl })
                  if (res.kind === 'copied') toast.success('已复制文章链接')
                } catch {
                  toast.error('分享失败，请重试')
                } finally {
                  window.setTimeout(() => setShareBusy(false), 800)
                }
              }}
            >
              <ShareNetworkIcon {...ICON_SM} />
              分享
            </button>
          </div>
        </div>
      </ToneSection>

      {/* Article body — sage background for readability */}
      <ToneSection tone="sage" as="article" className="py-24">
        <div className="site-wrap">
          <div className="max-w-article mx-auto" ref={articleRef}>
            <ArticleBody html={safeHtml} />
          </div>
        </div>
      </ToneSection>

      {/* Related articles */}
      {related.length > 0 && (
        <ToneSection tone="ink" as="section" className="py-24 site-wrap">
          <SectionLabel label="RELATED" />
          <h2 className="text-h2 font-medium mt-8 mb-12">相关文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
            {related.map((a, idx) => {
              const num = String(idx + 1).padStart(2, '0')
              return (
                <Link
                  key={a.id}
                  to={toPostPath(a.slug)}
                  className="group flex flex-col gap-2 py-6 border-t border-line hover:opacity-70 transition-opacity"
                >
                  <span className="text-label text-fg-muted">{num}</span>
                  <span className="text-label text-fg-muted">{a.category}</span>
                  <h3 className="text-h2 font-medium leading-snug mt-1 group-hover:text-fg transition-colors">
                    {a.title}
                  </h3>
                  <span className="text-label text-fg-muted mt-auto pt-2">{a.date}</span>
                </Link>
              )
            })}
          </div>
        </ToneSection>
      )}
    </ToneSection>
  )
}

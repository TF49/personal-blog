import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { ICON_SM } from './icon'
import PostPreview from './PostPreview'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Article } from '@/types'

interface PostIndexProps {
  articles: Article[]
}

/** 检测当前设备是否支持指针悬停(排除触屏设备) */
function canHover(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover)').matches
}

/**
 * Two-column staggered article list (Josué Pichot style).
 * Hover/focus: hovered row stays full opacity, others dim to 40%.
 * PostPreview card follows cursor via fixed positioning.
 * 触屏 / (hover: none) 设备不显示浮动预览。
 */
export default function PostIndex({ articles }: PostIndexProps) {
  const reduced = useReducedMotion()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseEnter = useCallback((id: string, e: React.MouseEvent) => {
    if (!canHover()) return
    setHoveredId(id)
    setCursorPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
  }, [])

  // 键盘聚焦:只在 hover 能力的设备上才弹出浮动预览
  const handleFocus = useCallback((id: string) => {
    if (!canHover()) return
    setHoveredId(id)
  }, [])

  const handleBlur = useCallback(() => {
    // 延迟一帧,允许焦点移入同容器内另一行而不闪烁
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setHoveredId(null)
      }
    }, 0)
  }, [])

  const hoveredArticle = hoveredId ? articles.find((a) => a.id === hoveredId) : null
  const showPreview = !reduced && canHover() && hoveredArticle != null

  // 预览卡位置:跟随光标偏移 20px,右侧夹紧视口(w-72 = 288px)
  const previewW = 288
  const margin = 24
  const rawX = cursorPos.x + 20
  const clampedX = Math.min(
    rawX,
    (typeof window !== 'undefined' ? window.innerWidth : 1440) - previewW - margin,
  )
  const clampedY = Math.max(8, cursorPos.y - 60)

  return (
    <div ref={containerRef} className="relative">
      {/* Article rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        {articles.map((article, idx) => {
          const num = String(idx + 1).padStart(2, '0')
          const isHovered = article.id === hoveredId
          const isDimmed = hoveredId !== null && !isHovered

          return (
            <Link
              key={article.id}
              to={`/blog/${encodeURIComponent(article.slug)}`}
              className={[
                'group flex items-center gap-6 py-6 px-0 border-t border-line',
                'transition-opacity duration-200',
                isDimmed ? 'opacity-40' : 'opacity-100',
              ].join(' ')}
              onMouseEnter={(e) => handleMouseEnter(article.id, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              onFocus={() => handleFocus(article.id)}
              onBlur={handleBlur}
            >
              {/* Left: number + category */}
              <div className="flex flex-col items-start gap-1 min-w-[4rem] shrink-0">
                <span className="text-label text-fg-muted tabular-nums">{num}</span>
                <span className="text-label text-fg-muted line-clamp-1">{article.category}</span>
              </div>

              {/* Center: title + summary */}
              <div className="flex-1 min-w-0">
                <h2 className="text-h2 font-medium leading-snug line-clamp-2 group-hover:text-fg transition-colors">
                  {article.title}
                </h2>
                {article.summary && (
                  <p className="text-body text-fg-muted mt-1 line-clamp-1">{article.summary}</p>
                )}
              </div>

              {/* Right: date + arrow */}
              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                <span className="text-label text-fg-muted whitespace-nowrap">{article.date}</span>
                <ArrowUpRightIcon
                  {...ICON_SM}
                  className="text-fg-muted group-hover:text-fg transition-colors"
                />
              </div>
            </Link>
          )
        })}
      </div>

      {/* 浮动预览卡:仅 hover 设备 + 非 reduced-motion */}
      {showPreview && hoveredArticle && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: clampedX, top: clampedY }}
        >
          <PostPreview article={hoveredArticle} />
        </div>
      )}
    </div>
  )
}

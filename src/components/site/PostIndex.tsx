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
  return window.innerWidth >= 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

type PreviewPosition = { x: number; y: number }

const PREVIEW_WIDTH = 272
const PREVIEW_HEIGHT = 220
const PREVIEW_MARGIN = 20

function positionPreview(row: HTMLElement): PreviewPosition {
  const rect = row.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const placeRight = rect.left + rect.width / 2 <= viewportWidth / 2
  const desiredX = placeRight
    ? rect.right + 18
    : rect.left - PREVIEW_WIDTH - 18
  const x = Math.min(
    Math.max(PREVIEW_MARGIN, desiredX),
    viewportWidth - PREVIEW_WIDTH - PREVIEW_MARGIN,
  )

  const below = rect.bottom + 16
  const y = below + PREVIEW_HEIGHT <= viewportHeight - PREVIEW_MARGIN
    ? below
    : Math.max(PREVIEW_MARGIN, rect.top - PREVIEW_HEIGHT - 16)

  return { x, y }
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
  const [previewPos, setPreviewPos] = useState<PreviewPosition>({ x: PREVIEW_MARGIN, y: PREVIEW_MARGIN })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback((id: string, e: React.MouseEvent) => {
    if (!canHover()) return
    setHoveredId(id)
    setPreviewPos(positionPreview(e.currentTarget as HTMLElement))
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
  }, [])

  // 键盘聚焦:只在 hover 能力的设备上才弹出浮动预览
  const handleFocus = useCallback((id: string, e: React.FocusEvent) => {
    if (!canHover()) return
    setHoveredId(id)
    setPreviewPos(positionPreview(e.currentTarget as HTMLElement))
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
                'group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-t border-line px-0 py-6',
                'sm:flex sm:items-center sm:gap-6',
                'transition-opacity duration-200',
                isDimmed ? 'opacity-40' : 'opacity-100',
              ].join(' ')}
              onMouseEnter={(e) => handleMouseEnter(article.id, e)}
              onMouseLeave={handleMouseLeave}
              onFocus={(e) => handleFocus(article.id, e)}
              onBlur={handleBlur}
            >
              {/* Left: number + category */}
              <div className="flex flex-col items-start gap-1 min-w-[4rem] shrink-0">
                <span className="text-label text-fg-muted tabular-nums">{num}</span>
                <span className="text-label text-fg-muted line-clamp-1">{article.category}</span>
              </div>

              {/* Center: title + summary */}
              <div className="flex-1 min-w-0">
                <h2 className="text-h2 font-medium leading-snug group-hover:text-fg transition-colors sm:line-clamp-2">
                  {article.title}
                </h2>
                <div className="mt-3 flex items-center justify-between gap-4 text-label text-fg-muted sm:hidden">
                  <span>{article.date}</span>
                  <ArrowUpRightIcon {...ICON_SM} aria-hidden />
                </div>
                {article.summary && (
                  <p className="mt-2 line-clamp-2 text-body text-fg-muted sm:mt-1 sm:line-clamp-1">{article.summary}</p>
                )}
              </div>

              {/* Right: date + arrow */}
              <div className="ml-4 hidden shrink-0 flex-col items-end gap-1 sm:flex">
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
          style={{ left: previewPos.x, top: previewPos.y }}
        >
          <PostPreview article={hoveredArticle} />
        </div>
      )}
    </div>
  )
}

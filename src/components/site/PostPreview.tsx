import type { Article } from '@/types'

interface PostPreviewProps {
  article: Article
}

/**
 * Floating preview card shown on hover/focus of a PostIndex row.
 * Always dark card (bg-ink text-fg).
 * - If article.cover: shows cover image
 * - If no cover: shows "typography card" (category, date, title)
 */
export default function PostPreview({ article }: PostPreviewProps) {
  return (
    <div
      aria-hidden="true"
      className="w-72 bg-ink text-fg rounded-img overflow-hidden pointer-events-none select-none"
    >
      {article.cover ? (
        <img
          src={article.cover}
          alt=""
          className="rounded-img w-full object-cover aspect-video"
          loading="eager"
        />
      ) : (
        <div className="p-6 flex flex-col gap-3">
          <span className="text-label uppercase text-fg-muted tracking-widest">
            {article.category}
          </span>
          <span className="text-label text-fg-muted">{article.date}</span>
          <h3 className="text-h2 font-medium leading-snug">{article.title}</h3>
        </div>
      )}
    </div>
  )
}

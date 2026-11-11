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
      className="w-[17rem] overflow-hidden rounded-img border border-line-sage bg-sage text-on-sage shadow-[0_18px_54px_rgb(16_18_15/0.22)] pointer-events-none select-none"
    >
      {article.cover ? (
        <img
          src={article.cover}
          alt=""
          className="rounded-img w-full object-cover aspect-video"
          loading="eager"
        />
      ) : (
        <div className="flex min-h-[190px] flex-col p-6">
          <span className="text-label uppercase text-on-sage-muted tracking-widest">
            {article.category}
          </span>
          <h3 className="mt-5 text-[22px] font-medium leading-snug">{article.title}</h3>
          <span className="mt-auto pt-5 text-label text-on-sage-muted">{article.date}</span>
        </div>
      )}
    </div>
  )
}

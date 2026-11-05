import type { TimelineEvent } from '@/types'

interface TimelineProps {
  events: TimelineEvent[]
}

/**
 * 居中窄栏时间线(参考 Sean Currlin 的经历区):宽 670px,每段一行分隔线,
 * 依次是阶段、标题、说明。纯排版,不加动效。
 */
export default function Timeline({ events }: TimelineProps) {
  return (
    <ol className="mx-auto max-w-timeline">
      {events.map((e, i) => (
        <li key={`${e.year}-${i}`} className="border-t border-line py-10 last:border-b md:py-12">
          <p className="text-label text-fg-muted">
            <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span aria-hidden="true"> / </span>
            {e.year}
          </p>
          <h3 className="mt-4 text-h2 font-medium">{e.title}</h3>
          <p className="mt-3 text-body text-fg-muted">{e.description}</p>
        </li>
      ))}
    </ol>
  )
}

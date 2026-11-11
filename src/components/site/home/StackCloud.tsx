import type { TechItem } from '@/types'
import SectionLabel from '../SectionLabel'

interface StackCloudProps {
  groups: Record<string, TechItem[]>
  labels: Record<string, string>
  index: number
}

/**
 * 技术栈段(ink)。按方向分行,每行是一串用斜杠分隔的技术名;
 * 第一行用正文色,其余行用弱化色,形成由近及远的层次。悬停某一行时该行提亮。
 */
export default function StackCloud({ groups, labels, index }: StackCloudProps) {
  const entries = Object.entries(groups)

  return (
    <div className="site-wrap py-24 md:flex md:min-h-[100svh] md:flex-col md:py-32">
      <SectionLabel label="STACK" index={index} />

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] md:items-end">
        <h2 id="stack-heading" className="text-h1 font-semibold">
          日常在用的技术
        </h2>
        <p className="text-body text-fg-muted">
          按方向分组。比起列得更长，我更在意每一项都真的在项目里用过、踩过坑、能讲清楚取舍。
        </p>
      </div>

      <ul className="mt-16 flex flex-col items-center gap-5 text-center md:my-auto md:gap-7 md:pt-16">
        {entries.map(([key, items], row) => (
          <li
            key={key}
            className={[
              'max-w-[60rem] transition-colors duration-200',
              row === 0 ? 'text-fg' : 'text-fg-muted',
              'hover:text-fg',
            ].join(' ')}
          >
            <span className="sr-only">{labels[key] ?? key}:</span>
            <span className="text-[clamp(16px,1.55vw,22px)] font-medium uppercase leading-[1.6] tracking-[0.01em]">
              {items.map((item) => (
                <span key={item.name} className="whitespace-nowrap">
                  <span aria-hidden="true" className="mx-[0.5em] text-line">
                    /
                  </span>
                  {item.name}{' '}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

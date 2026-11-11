import type { ReactNode } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import SectionLabel from '../SectionLabel'
import { ICON_SM } from '../icon'

interface QandAProps {
  index: number
  email: string
  /** 写信区锚点 id,最后一问会链接过去 */
  contactId: string
}

interface QA {
  q: string
  a: ReactNode
}

const linkClass = 'text-fg underline decoration-1 underline-offset-4 transition-colors hover:text-fg-muted'

/**
 * 问答段(ink)。左栏标题(桌面端 sticky),右栏为原生 details/summary 折叠列表,
 * 键盘与读屏直接可用,不依赖脚本。回答只写能被站点和仓库核对的事实。
 */
export default function QandA({ index, email, contactId }: QandAProps) {
  const items: QA[] = [
    {
      q: '文章从哪里来？',
      a: (
        <>
          文章写在{' '}
          <a href="https://github.com/TF49/blog-content/issues" target="_blank" rel="noopener noreferrer" className={linkClass}>
            TF49/blog-content
            <span className="sr-only">(在新标签页打开)</span>
          </a>{' '}
          的 Issues 里，带 blog 标签的 Issue 会被定时同步成 JSON，随站点一起静态发布。改文章不需要改网站代码。
        </>
      ),
    },
    {
      q: '现在主要在做什么？',
      a: '以独立开发为主：用 Tauri + Rust 做 AI Agent 管理工具 AI Helper，用 Python + LLM 做视频创作平台 BobVideo。开发中遇到的取舍和复盘，会整理成这里的文章。',
    },
    {
      q: '文章旁边的数字是阅读量吗？',
      a: '不是。这个站点没有任何统计脚本，文章旁显示的是对应 Issue 的评论数。你的访问不会被记录或上报。',
    },
    {
      q: '发现文章有错误，怎么反馈？',
      a: '可以在内容仓库对应的 Issue 下直接评论，修正后会在下一次同步时更新到站点；也可以写信告诉我。',
    },
    {
      q: '怎么联系你？',
      a: (
        <>
          用下方的
          <a href={`#${contactId}`} className={`mx-1 ${linkClass}`}>
            写信表单
          </a>
          生成邮件草稿，或直接发邮件到{' '}
          <a href={`mailto:${email}`} className={`break-all ${linkClass}`}>
            {email}
          </a>
          。微信号在关于页。
        </>
      ),
    },
  ]

  return (
    <div className="site-wrap py-24 md:py-32">
      <SectionLabel label="Q&A" index={index} />

      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20">
        <div className="md:sticky md:top-[calc(var(--header-h)+32px)] md:self-start">
          <h2 id="qa-heading" className="text-h1 font-semibold">
            常见问题
          </h2>
          <p className="mt-5 max-w-[22em] text-body text-fg-muted">
            关于这个博客如何运作、作者在做什么，以及怎样联系。
          </p>
        </div>

        <ul className="border-b border-line">
          {items.map((item, i) => (
            <li key={item.q} className="border-t border-line">
              <details className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-6 py-6 transition-colors hover:text-fg md:py-7 [&::-webkit-details-marker]:hidden">
                  <span className="w-10 shrink-0 text-label tabular-nums text-fg-muted">{`Q.${String(i + 1).padStart(2, '0')}`}</span>
                  <span className="flex-1 text-[clamp(18px,1.6vw,24px)] font-medium">{item.q}</span>
                  <PlusIcon
                    {...ICON_SM}
                    aria-hidden
                    className="shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:text-fg motion-reduce:transition-none"
                  />
                </summary>
                <p className="max-w-[36em] pb-8 pl-16 text-body text-fg-muted">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

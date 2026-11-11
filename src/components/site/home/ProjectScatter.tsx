import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import type { GitHubRepo } from '@/types'
import { ICON_SM } from '../icon'

interface ProjectScatterProps {
  repos: GitHubRepo[]
  /** true:数据来自 GitHub API(含本地缓存);false:本地精选兜底数据 */
  live: boolean
  index: number
}

const relativeFormat = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' })

/** 把 ISO 时间格式化为"3 天前 / 2 个月前",无效时间返回 null */
function formatRelative(iso: string | undefined): string | null {
  if (!iso) return null
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return null
  const days = Math.round((time - Date.now()) / 86_400_000)
  if (Math.abs(days) < 31) return relativeFormat.format(days, 'day')
  if (Math.abs(days) < 365) return relativeFormat.format(Math.round(days / 30), 'month')
  return relativeFormat.format(Math.round(days / 365), 'year')
}

/** 桌面端项目名的散布落点(相对分区),左右交错、上下错开 */
const SPOTS = [
  { left: '4%', top: '22%' },
  { right: '6%', top: '30%' },
  { left: '10%', top: '54%' },
  { right: '2%', top: '63%' },
  { left: '36%', top: '86%' },
  { right: '30%', top: '12%' },
] as const

/**
 * 项目段(ink)。桌面端项目名散布在整屏,悬停/聚焦时其余项目变暗,
 * 中央面板显示该仓库的语言、说明和主题;手机端退化为单列文字索引。
 * 优先使用 GitHub API 的实时数据(最近推送时间),失败时回退到本地精选仓库;
 * 本地数据的时间是手写的,不展示。任何情况下都不显示星标数。
 */
export default function ProjectScatter({ repos, live, index }: ProjectScatterProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const list = repos.slice(0, SPOTS.length)
  const active = list.find((r) => r.id === activeId) ?? null
  const pushedAgo = (repo: GitHubRepo) => (live ? formatRelative(repo.pushed_at) : null)

  return (
    <div className="site-wrap relative py-24 md:flex md:min-h-[100svh] md:flex-col md:py-16">
      <div className="relative flex items-start justify-between text-label uppercase md:grid md:grid-cols-3" aria-hidden="true">
        <span className="hidden md:block" />
        <span className="md:text-center">( PROJECTS. )</span>
        <span className="text-right text-fg-muted">{`[ N.${String(index).padStart(3, '0')} ]`}</span>
      </div>
      <h2 id="projects-heading" className="mt-10 text-h1 font-semibold md:sr-only">
        开源项目
      </h2>

      <div
        className="relative mt-10 md:mt-0 md:flex-1"
        onMouseLeave={() => setActiveId(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActiveId(null)
        }}
      >
        {/* 中央说明面板:仅桌面 */}
        <div
          aria-live="polite"
          className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[min(400px,32vw)] -translate-x-1/2 -translate-y-1/2 text-center md:block"
        >
          {active ? (
            <div key={active.id} className="menu-enter">
              <p className="text-label uppercase text-fg-muted">
                {active.language ?? 'Repository'}
                {pushedAgo(active) && <span className="normal-case">{` · 最近推送 ${pushedAgo(active)}`}</span>}
              </p>
              <p className="mt-4 text-h2 font-semibold">{active.name}</p>
              {active.description && <p className="mt-4 text-body text-fg-muted">{active.description}</p>}
              {active.topics && active.topics.length > 0 && (
                <p className="mt-5 text-label lowercase text-fg-muted">
                  {active.topics.slice(0, 5).map((t) => `#${t}`).join('  ')}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-h1 font-semibold">{list.length}</p>
              <p className="mt-3 text-label text-fg-muted">个公开仓库 · 悬停或聚焦项目名查看说明</p>
            </div>
          )}
        </div>

        <ol className="border-b border-line md:border-0">
          {list.map((repo, i) => {
            const dimmed = activeId !== null && activeId !== repo.id
            return (
              <li
                key={repo.id}
                style={SPOTS[i]}
                className="border-t border-line md:absolute md:border-0"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActiveId(repo.id)}
                  onFocus={() => setActiveId(repo.id)}
                  className={[
                    'group flex min-h-11 flex-col gap-2 py-6 transition-opacity duration-200 md:py-2',
                    dimmed ? 'md:opacity-30' : 'opacity-100',
                  ].join(' ')}
                >
                  <span className="text-label uppercase text-fg-muted">{`P.${String(i + 1).padStart(2, '0')}`}</span>
                  <span className="flex items-center gap-3 text-h2 font-medium uppercase md:text-[clamp(17px,1.5vw,22px)]">
                    {repo.name}
                    <ArrowUpRightIcon
                      {...ICON_SM}
                      aria-hidden
                      className="text-fg-muted transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                    />
                  </span>
                  {repo.description && <span className="text-body text-fg-muted md:sr-only">{repo.description}</span>}
                  {pushedAgo(repo) && (
                    <span className="text-label text-fg-muted md:sr-only">{`最近推送 ${pushedAgo(repo)}`}</span>
                  )}
                  <span className="sr-only">(在新标签页打开)</span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4 md:mt-0">
        <p className="flex items-center gap-2 text-label uppercase text-fg-muted">
          <span
            aria-hidden="true"
            className={`inline-block h-1.5 w-1.5 rounded-full ${live ? 'bg-current motion-safe:animate-pulse' : 'border border-current'}`}
          />
          {live ? 'Live · GitHub API' : 'Local · 本地精选数据'}
        </p>
        <Link
          to="/about"
          className="inline-flex min-h-11 items-center border-b border-line text-label text-fg-muted transition-colors hover:text-fg"
        >
          经历与技术栈 →
        </Link>
      </div>
    </div>
  )
}

import { ArrowUpRightIcon } from '@phosphor-icons/react'
import type { GitHubRepo } from '@/types'
import { ICON_SM } from './icon'

interface RepoListProps {
  repos: GitHubRepo[]
  /** 数据是否来自 GitHub API(含缓存)。本地兜底数据的星标数不可信,不显示 */
  live: boolean
}

/**
 * GitHub 精选仓库列表。与文章索引同一套交互:
 * 悬停或聚焦某一行时,其余行降到 40% 不透明度。
 */
export default function RepoList({ repos, live }: RepoListProps) {
  return (
    <ul className="group/list border-b border-line">
      {repos.map((repo) => (
        <li key={repo.full_name}>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'group flex items-start gap-6 border-t border-line py-8 transition-opacity duration-200',
              'group-hover/list:opacity-40 hover:!opacity-100',
              'group-focus-within/list:opacity-40 focus-visible:!opacity-100',
            ].join(' ')}
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-h2 font-medium">{repo.name}</h3>
              {repo.description && <p className="mt-2 text-body text-fg-muted">{repo.description}</p>}
              <p className="mt-3 flex flex-wrap gap-x-4 text-label text-fg-muted">
                {repo.language && <span>{repo.language}</span>}
                {live && <span>星标 {repo.stargazers_count}</span>}
              </p>
            </div>
            <ArrowUpRightIcon {...ICON_SM} aria-hidden className="mt-2 shrink-0 text-fg-muted group-hover:text-fg" />
            <span className="sr-only">(在新标签页打开)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

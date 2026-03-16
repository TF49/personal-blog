import type { GitHubRepo } from '@/types'

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

export type GetFeaturedReposOptions = {
  limit?: number
  includeForks?: boolean
  includeArchived?: boolean
}

export async function getPinnedRepos(
  fullNames: string[],
): Promise<{ repos: GitHubRepo[]; error?: string }> {
  if (!fullNames.length) return { repos: [] }

  try {
    const results = await Promise.all(
      fullNames.map(async (fullName) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${encodeURIComponent(fullName)}`,
            {
              headers: {
                Accept: 'application/vnd.github+json',
              },
            },
          )
          if (!res.ok) {
            return null
          }
          return (await res.json()) as GitHubRepo
        } catch {
          return null
        }
      }),
    )

    const repos = results.filter((r): r is GitHubRepo => r != null)
    return { repos }
  } catch (err) {
    return { repos: [], error: toErrorMessage(err) }
  }
}

export async function getFeaturedRepos(
  username: string,
  opts: GetFeaturedReposOptions = {},
): Promise<{ repos: GitHubRepo[]; error?: string }> {
  const limit = opts.limit ?? 4
  const includeForks = opts.includeForks ?? false
  const includeArchived = opts.includeArchived ?? false

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    )

    if (!res.ok) {
      let detail = ''
      try {
        const body = (await res.json()) as { message?: string }
        detail = body?.message ? ` (${body.message})` : ''
      } catch {
        // ignore
      }
      return { repos: [], error: `GitHub API 请求失败：${res.status}${detail}` }
    }

    const data = (await res.json()) as GitHubRepo[]
    const filtered = data.filter((r) => {
      if (!includeForks && r.fork) return false
      if (!includeArchived && r.archived) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count
      return b.pushed_at.localeCompare(a.pushed_at)
    })

    return { repos: sorted.slice(0, limit) }
  } catch (err) {
    return { repos: [], error: `获取 GitHub 仓库失败：${toErrorMessage(err)}` }
  }
}

export function getRepoOgImageUrl(fullName: string) {
  // GitHub OpenGraph 预览图（无需 key；key 只是用来做缓存分片）
  return `https://opengraph.githubassets.com/1/${fullName}`
}

import type { GitHubRepo } from '@/types'
import { fallbackRepos } from '@/data/featuredRepos'

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

function isPrerendering() {
  try {
    const w = window as unknown as { __PRERENDER_INJECTED?: { prerender?: boolean } }
    return Boolean(w?.__PRERENDER_INJECTED?.prerender)
  } catch {
    return false
  }
}

const CACHE_KEY = 'tf49_github_repos_cache_v1'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 分钟缓存

interface CachePayload {
  timestamp: number
  reposMap: Record<string, GitHubRepo>
}

function getLocalCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CachePayload
  } catch {
    return null
  }
}

function saveToLocalCache(reposMap: Record<string, GitHubRepo>) {
  try {
    const existing = getLocalCache()?.reposMap || {}
    const updatedMap = { ...existing, ...reposMap }
    const payload: CachePayload = {
      timestamp: Date.now(),
      reposMap: updatedMap,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

async function fetchJson<T>(url: string, init: RequestInit = {}, timeoutMs = 6500): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      ...(init.headers as Record<string, string>),
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(url, { ...init, headers, signal: controller.signal })
    if (!res.ok) {
      let detail = ''
      try {
        const body = (await res.json()) as { message?: string }
        detail = body?.message ? ` (${body.message})` : ''
      } catch {
        // ignore
      }
      throw new Error(`GitHub API 请求失败：${res.status}${detail}`)
    }
    return (await res.json()) as T
  } finally {
    window.clearTimeout(timer)
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
  if (!fullNames.length) return { repos: fallbackRepos }
  if (isPrerendering()) {
    return { repos: fallbackRepos, error: 'prerender: skip GitHub request' }
  }

  // 优先读取有效缓存
  const cache = getLocalCache()
  const isCacheValid = cache && Date.now() - cache.timestamp < CACHE_TTL_MS
  if (isCacheValid && cache.reposMap) {
    const cachedRepos = fullNames.map((fn) => cache.reposMap[fn]).filter(Boolean)
    if (cachedRepos.length === fullNames.length) {
      return { repos: cachedRepos }
    }
  }

  let capturedError: string | undefined

  try {
    const newFetchedMap: Record<string, GitHubRepo> = {}
    const results = await Promise.all(
      fullNames.map(async (fullName) => {
        const [ownerRaw, repoRaw] = fullName.split('/')
        const owner = ownerRaw?.trim()
        const repo = repoRaw?.trim()
        if (!owner || !repo) return null

        try {
          const res = await fetchJson<GitHubRepo>(
            `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
          )
          if (res) {
            newFetchedMap[fullName] = res
          }
          return res
        } catch (err) {
          if (!capturedError) {
            capturedError = toErrorMessage(err)
          }
          return null
        }
      }),
    )

    const fetchedRepos = results.filter((r): r is GitHubRepo => r != null)

    if (fetchedRepos.length > 0) {
      saveToLocalCache(newFetchedMap)
      return { repos: fetchedRepos, error: capturedError }
    }

    // API 失败时优先退回陈旧缓存，无缓存时退回 fallbackRepos
    if (cache && cache.reposMap) {
      const staleRepos = fullNames.map((fn) => cache.reposMap[fn]).filter(Boolean)
      if (staleRepos.length > 0) {
        return { repos: staleRepos, error: capturedError }
      }
    }

    return { repos: fallbackRepos, error: capturedError }
  } catch (err) {
    if (cache && cache.reposMap) {
      const staleRepos = fullNames.map((fn) => cache.reposMap[fn]).filter(Boolean)
      if (staleRepos.length > 0) {
        return { repos: staleRepos, error: toErrorMessage(err) }
      }
    }
    return { repos: fallbackRepos, error: toErrorMessage(err) }
  }
}

export async function getFeaturedRepos(
  username: string,
  opts: GetFeaturedReposOptions = {},
): Promise<{ repos: GitHubRepo[]; error?: string }> {
  const limit = opts.limit ?? 4
  const includeForks = opts.includeForks ?? false
  const includeArchived = opts.includeArchived ?? false

  if (isPrerendering()) {
    return { repos: fallbackRepos.slice(0, limit), error: 'prerender: skip GitHub request' }
  }

  try {
    const data = await fetchJson<GitHubRepo[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )
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
    return { repos: fallbackRepos.slice(0, limit), error: `获取 GitHub 仓库失败：${toErrorMessage(err)}` }
  }
}

export function getRepoOgImageUrl(fullName: string) {
  // GitHub OpenGraph 预览图（无需 key；key 只是用来做缓存分片）
  return `https://opengraph.githubassets.com/1/${fullName}`
}

import type { Article, AuthorProfile } from '@/types'
import { profile } from '@/data/profile'
import { techStackByCategory } from '@/data/techStack'
import { timelineEvents } from '@/data/timeline'
import { featuredRepoFullNames } from '@/data/featuredRepos'
import { getFeaturedRepos, getRepoOgImageUrl, getPinnedRepos } from '@/api/github'

export { featuredRepoFullNames, getFeaturedRepos, getRepoOgImageUrl, getPinnedRepos }

let cachedArticlesPromise: Promise<Article[]> | null = null

function getArticlesUrl() {
  // Works with Vite base "./" (GH Pages) and "/" (dev)
  const base = import.meta.env.BASE_URL ?? '/'
  return `${base}${base.endsWith('/') ? '' : '/'}articles.json`
}

async function loadArticles(): Promise<Article[]> {
  if (cachedArticlesPromise) return cachedArticlesPromise
  cachedArticlesPromise = (async () => {
    const url = getArticlesUrl()
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) {
      throw new Error(`Failed to load articles.json (${res.status})`)
    }
    const data = (await res.json()) as unknown
    if (!Array.isArray(data)) return []
    return data as Article[]
  })()
  return cachedArticlesPromise
}

export async function getProfile(): Promise<AuthorProfile> {
  return Promise.resolve(profile)
}

export function getTechStack() {
  return techStackByCategory
}

export function getTimeline() {
  return timelineEvents
}

export async function getArticles(): Promise<Article[]> {
  const articles = await loadArticles()
  return [...articles].sort((a, b) => b.date.localeCompare(a.date))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await loadArticles()
  const found = articles.find((a) => a.slug === slug)
  return found ?? null
}

export async function getRecentArticles(limit = 6): Promise<Article[]> {
  const all = await getArticles()
  return all.slice(0, limit)
}

export type GetRecommendedArticlesOptions = {
  currentCategory?: string
  excludeIds?: string[]
  limit?: number
}

export async function getRecommendedArticles(
  opts: GetRecommendedArticlesOptions = {},
): Promise<Article[]> {
  const limit = opts.limit ?? 3
  const exclude = new Set(opts.excludeIds ?? [])
  const category = opts.currentCategory?.trim()

  const articles = await getArticles()
  const pool = articles.filter((a) => !exclude.has(a.id))

  if (!limit || limit <= 0) return []

  const picked: Article[] = []

  if (category) {
    for (const a of pool) {
      if (picked.length >= limit) break
      if (a.category === category) {
        picked.push(a)
        exclude.add(a.id)
      }
    }
  }

  if (picked.length < limit) {
    for (const a of pool) {
      if (picked.length >= limit) break
      if (!exclude.has(a.id)) {
        picked.push(a)
        exclude.add(a.id)
      }
    }
  }

  return picked
}

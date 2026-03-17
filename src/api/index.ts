import type { Article, AuthorProfile } from '@/types'
import { profile } from '@/data/profile'
import { techStackByCategory } from '@/data/techStack'
import { highlights } from '@/data/highlights'
import { timelineEvents } from '@/data/timeline'
import { stats } from '@/data/stats'
export { featuredRepoFullNames } from '@/data/featuredRepos'
export { getFeaturedRepos, getRepoOgImageUrl, getPinnedRepos } from '@/api/github'

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

export function getHighlights() {
  return highlights
}

export function getTimeline() {
  return timelineEvents
}

export function getStats() {
  return stats
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

export function getRandomArticles(limit = 3): Promise<Article[]> {
  return loadArticles().then((articles) => {
    const shuffled = [...articles].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, limit)
  })
}

export function getCategories(): string[] {
  // Keep this sync for existing callsites; categories are derived from cached article load.
  // If called before articles are loaded, it returns [] until the next render.
  // Blog page already calls getArticles() which will populate cache.
  return []
}

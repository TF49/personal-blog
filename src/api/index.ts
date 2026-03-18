import type { Article, AuthorProfile, GitHubRepo } from '@/types'
import { profile } from '@/data/profile'
import { techStackByCategory } from '@/data/techStack'
import { highlights } from '@/data/highlights'
import { timelineEvents } from '@/data/timeline'
import { stats } from '@/data/stats'
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

export type HomeMetric = {
  label: string
  value: string
  unit?: string
}

export type HomeSnapshot = {
  recentArticles: Article[]
  featuredArticles: Article[]
  metrics: HomeMetric[]
  pinnedRepos: GitHubRepo[]
  githubError?: string
}

function clampNonNegativeInt(n: number, fallback: number) {
  if (!Number.isFinite(n)) return fallback
  const v = Math.floor(n)
  return v < 0 ? 0 : v
}

function daysAgoISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function sumStars(repos: GitHubRepo[]) {
  return repos.reduce((acc, r) => acc + (typeof r.stargazers_count === 'number' ? r.stargazers_count : 0), 0)
}

export async function getHomeSnapshot(): Promise<HomeSnapshot> {
  const articles = await getArticles()

  const recentArticles = articles.slice(0, 3)
  const featuredArticles = [...articles]
    .sort((a, b) => {
      const ar = typeof a.readCount === 'number' ? a.readCount : 0
      const br = typeof b.readCount === 'number' ? b.readCount : 0
      if (br !== ar) return br - ar
      return String(b.date).localeCompare(String(a.date))
    })
    .slice(0, 3)

  const categoryCount = new Set(articles.map((a) => a.category)).size
  const cutoff = daysAgoISO(30)
  const updatedLast30Days = articles.filter((a) => String(a.date) >= cutoff).length

  // GitHub pinned repos are already configured for ProjectShowcase
  const username = 'TF49'
  const { repos: pinnedRepos, error: githubError } =
    featuredRepoFullNames.length > 0
      ? await getPinnedRepos(featuredRepoFullNames)
      : await getFeaturedRepos(username, { limit: 6 })

  const starTotal = sumStars(pinnedRepos)

  const metrics: HomeMetric[] = [
    { label: '文章总数', value: String(articles.length) },
    { label: '分类数量', value: String(categoryCount) },
    { label: '近 30 天更新', value: String(updatedLast30Days) },
    { label: 'GitHub Stars', value: String(clampNonNegativeInt(starTotal, 0)) },
  ]

  return {
    recentArticles,
    featuredArticles,
    metrics,
    pinnedRepos,
    githubError,
  }
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

export function getCategories(): string[] {
  // Keep this sync for existing callsites; categories are derived from cached article load.
  // If called before articles are loaded, it returns [] until the next render.
  // Blog page already calls getArticles() which will populate cache.
  return []
}

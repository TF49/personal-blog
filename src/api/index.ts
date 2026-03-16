import type { Article, AuthorProfile } from '@/types'
import { profile } from '@/data/profile'
import { techStackByCategory } from '@/data/techStack'
import { highlights } from '@/data/highlights'
import { timelineEvents } from '@/data/timeline'
import { stats } from '@/data/stats'
export { featuredRepoFullNames } from '@/data/featuredRepos'
import articlesData from '@/data/articles.json'
export { getFeaturedRepos, getRepoOgImageUrl, getPinnedRepos } from '@/api/github'

const articles = articlesData as Article[]

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
  return Promise.resolve([...articles].sort((a, b) => b.date.localeCompare(a.date)))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const found = articles.find((a) => a.slug === slug)
  return Promise.resolve(found ?? null)
}

export async function getRecentArticles(limit = 6): Promise<Article[]> {
  const all = await getArticles()
  return all.slice(0, limit)
}

export function getRandomArticles(limit = 3): Promise<Article[]> {
  const shuffled = [...articles].sort(() => Math.random() - 0.5)
  return Promise.resolve(shuffled.slice(0, limit))
}

export function getCategories(): string[] {
  const set = new Set(articles.map((a) => a.category))
  return Array.from(set)
}

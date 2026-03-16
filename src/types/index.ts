export interface AuthorProfile {
  name: string
  title: string
  bio: string
  avatar?: string
  wechat: string
  email: string
  social: SocialLink[]
}

export interface SocialLink {
  name: string
  url: string
  icon?: string
}

export interface TechItem {
  name: string
  category: 'language' | 'backend' | 'frontend' | 'database' | 'devops' | 'tool'
  logo?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  date: string
  readCount?: number
}

export interface TimelineEvent {
  year: string
  title: string
  description: string
}

export interface HighlightCard {
  title: string
  subtitle: string
  description: string
  icon: string
}

export interface StatBlock {
  value: string
  unit?: string
  label: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  topics?: string[]
  updated_at: string
  pushed_at: string
  archived: boolean
  fork: boolean
  homepage: string | null
}

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

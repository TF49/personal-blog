import type { GitHubRepo } from '@/types'

// 手动指定希望首页「精选作品」优先展示的仓库（GitHub full_name）
// 例如：'TF49/my-awesome-project'
// 留空数组则自动根据 star / 最近更新排序
export const featuredRepoFullNames: string[] = [
  'TF49/BMP',
  'TF49/CMS-Pro-Max',
  'TF49/personal-blog',
  'TF49/CatMusic',
]

export const fallbackRepos: GitHubRepo[] = [
  {
    id: 101,
    name: 'BMP',
    full_name: 'TF49/BMP',
    html_url: 'https://github.com/TF49/BMP',
    description: '基于 Spring Boot & Vue3 的现代管理平台与内容控制中台项目',
    language: 'Java',
    stargazers_count: 2,
    forks_count: 0,
    open_issues_count: 0,
    topics: ['java', 'spring-boot', 'vue3', 'management'],
    updated_at: '2026-08-01T12:00:00Z',
    pushed_at: '2026-08-01T12:00:00Z',
    archived: false,
    fork: false,
    homepage: null,
  },
  {
    id: 102,
    name: 'CMS-Pro-Max',
    full_name: 'TF49/CMS-Pro-Max',
    html_url: 'https://github.com/TF49/CMS-Pro-Max',
    description: '企业级全栈内容管理系统，集成 RBAC 权限控制与微服务架构支持',
    language: 'Java',
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    topics: ['cms', 'spring-cloud', 'rbac', 'fullstack'],
    updated_at: '2026-07-28T15:30:00Z',
    pushed_at: '2026-07-28T15:30:00Z',
    archived: false,
    fork: false,
    homepage: null,
  },
  {
    id: 103,
    name: 'personal-blog',
    full_name: 'TF49/personal-blog',
    html_url: 'https://github.com/TF49/personal-blog',
    description: '采用 React、Tailwind CSS 与动效引擎打造的高性能极致视效个人博客',
    language: 'TypeScript',
    stargazers_count: 1,
    forks_count: 0,
    open_issues_count: 0,
    topics: ['react', 'typescript', 'tailwind', 'blog', 'framer-motion'],
    updated_at: '2026-08-08T10:00:00Z',
    pushed_at: '2026-08-08T10:00:00Z',
    archived: false,
    fork: false,
    homepage: 'https://tf49.github.io/personal-blog',
  },
  {
    id: 104,
    name: 'CatMusic',
    full_name: 'TF49/CatMusic',
    html_url: 'https://github.com/TF49/CatMusic',
    description: '基于 Web Audio API 与现代前端构建的沉浸式音乐交互应用',
    language: 'TypeScript',
    stargazers_count: 2,
    forks_count: 0,
    open_issues_count: 0,
    topics: ['music', 'web-audio', 'react', 'audio-player'],
    updated_at: '2026-06-20T08:00:00Z',
    pushed_at: '2026-06-20T08:00:00Z',
    archived: false,
    fork: false,
    homepage: null,
  },
]



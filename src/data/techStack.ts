import type { TechItem } from '@/types'

export const techStackByCategory: Record<string, TechItem[]> = {
  language: [
    { name: 'Java', category: 'language' },
    { name: 'Go', category: 'language' },
    { name: 'Rust', category: 'language' },
    { name: 'TypeScript', category: 'language' },
    { name: 'Python', category: 'language' },
    { name: 'JavaScript', category: 'language' },
    { name: 'C', category: 'language' },
    { name: 'C++', category: 'language' },
    { name: 'HTML5', category: 'language' },
    { name: 'CSS3', category: 'language' },
  ],
  backend: [
    { name: 'Spring Boot', category: 'backend' },
    { name: 'Spring Cloud', category: 'backend' },
    { name: 'Spring Security', category: 'backend' },
    { name: 'Maven', category: 'backend' },
    { name: 'Gin', category: 'backend' },
    { name: 'Axum', category: 'backend' },
    { name: 'Tauri', category: 'backend' },
    { name: 'Node.js', category: 'backend' },
  ],
  frontend: [
    { name: 'React', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'Vue.js', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'Framer Motion', category: 'frontend' },
    { name: 'Android', category: 'frontend' },
  ],
  database: [
    { name: 'MySQL', category: 'database' },
    { name: 'PostgreSQL', category: 'database' },
    { name: 'Redis', category: 'database' },
    { name: 'SQLite', category: 'database' },
  ],
  devops: [
    { name: 'Docker', category: 'devops' },
    { name: 'Linux', category: 'devops' },
    { name: 'Nginx', category: 'devops' },
    { name: 'Git', category: 'devops' },
    { name: 'GitHub Actions', category: 'devops' },
    { name: 'CentOS', category: 'devops' },
  ],
  tool: [
    { name: 'IntelliJ IDEA', category: 'tool' },
    { name: 'VS Code', category: 'tool' },
    { name: 'Android Studio', category: 'tool' },
    { name: 'GoLand', category: 'tool' },
    { name: 'Postman', category: 'tool' },
  ],
}

export const categoryLabels: Record<string, string> = {
  language: '编程语言',
  backend: '后端 · 框架',
  frontend: '前端 · 移动端',
  database: '数据库',
  devops: 'DevOps · 运维',
  tool: '开发工具',
}

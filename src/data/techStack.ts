import type { TechItem } from '@/types'

export const techStackByCategory: Record<string, TechItem[]> = {
  language: [
    { name: 'Java', category: 'language' },
    { name: 'C', category: 'language' },
    { name: 'C++', category: 'language' },
    { name: 'Python', category: 'language' },
    { name: 'JavaScript', category: 'language' },
    { name: 'TypeScript', category: 'language' },
    { name: 'HTML5', category: 'language' },
    { name: 'CSS3', category: 'language' },
  ],
  backend: [
    { name: 'Spring', category: 'backend' },
    { name: 'Spring Boot', category: 'backend' },
    { name: 'Maven', category: 'backend' },
    { name: 'Node.js', category: 'backend' },
  ],
  frontend: [
    { name: 'Vue.js', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'Android', category: 'frontend' },
  ],
  database: [
    { name: 'MySQL', category: 'database' },
    { name: 'Redis', category: 'database' },
  ],
  devops: [
    { name: 'Git', category: 'devops' },
    { name: 'GitHub', category: 'devops' },
    { name: 'Linux', category: 'devops' },
    { name: 'CentOS', category: 'devops' },
    { name: 'Docker', category: 'devops' },
    { name: 'Nginx', category: 'devops' },
  ],
  tool: [
    { name: 'VS Code', category: 'tool' },
    { name: 'IntelliJ IDEA', category: 'tool' },
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

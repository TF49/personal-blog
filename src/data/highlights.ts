import type { HighlightCard } from '@/types'

export const highlights: HighlightCard[] = [
  {
    title: '全栈后端',
    subtitle: 'Java · Go · Rust',
    description: '从 Spring Boot 微服务到 Go 高性能 API 网关，再到 Rust + Tauri 跨平台桌面应用，覆盖多语言后端全链路。',
    icon: 'backend',
  },
  {
    title: '前端交互',
    subtitle: 'React · Next.js · Vue',
    description: '熟练使用 React / Next.js / Vue 构建现代前端，搭配 Tailwind CSS、Framer Motion 实现精致动效与 UI 设计系统。',
    icon: 'frontend',
  },
  {
    title: 'AI 工程化',
    subtitle: 'LLM · MCP · Python',
    description: '将 AI 能力落地为真实产品：LLM 驱动视频分镜（BobVideo）、MCP 协议桥接（AI Helper）、本地优先 AI 图像工作台（ImageHub）。',
    icon: 'devops',
  },
]

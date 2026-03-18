import type { TimelineEvent } from '@/types'

export const timelineEvents: TimelineEvent[] = [
  { year: '入学', title: '计算机相关专业', description: '系统学习计算机基础、数据结构与操作系统，为后续工程实践打下理论底座。' },
  { year: '课程阶段', title: 'Java / C++ / Python', description: '完成多门课程设计与综合实验，独立完成后端接口、小工具脚本等，形成第一批可复用代码。' },
  { year: '实践阶段', title: 'Linux 与部署', description: '在 CentOS 环境中搭建 Web 服务与数据库，完成从代码到上线的完整部署闭环，并尝试容器化。' },
  { year: '当下', title: '全栈与运维', description: '围绕个人项目与博客持续迭代，梳理开发笔记、整理问题清单，向「能独立交付线上可用系统」的方向推进。' },
]

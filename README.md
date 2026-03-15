# 涂家乐 · 个人博客（personal-blog）

基于 React + Vite + TypeScript + Tailwind CSS 的个人博客前端。

视觉风格参考南孚官网：全屏分区、大标题与数据块、三段式亮点卡片、时间线、产品式卡片布局，并搭配 Framer Motion 动效。

## 在线预览

部署完成后在此填写：

- `https://tf49.github.io/personal-blog/`

## 功能

- **首页**：工业风分区布局、数据块、动效组件
- **博客列表**：分类筛选、推荐阅读
- **博客详情**：按 `slug` 路由加载、正文渲染、相关推荐
- **关于我**：个人档案、联系方式、技术栈网格、成长时间线

## 技术栈

- **框架**：React 18
- **构建**：Vite 5
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **路由**：React Router（`HashRouter`，适配 GitHub Pages）
- **动效**：Framer Motion
- **图标**：lucide-react

## 本地运行

```bash
npm install
npm run dev
```

开发地址：

- `http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

构建产物输出到：

- `dist/`

## 目录结构

- `src/pages`：Home / Blog / BlogPost / About
- `src/components`：Header、Footer、Layout、SectionTitle、图标等
- `src/data`：本地数据（profile、techStack、articles、timeline、stats、highlights）
- `src/api`：数据接口封装（当前读取本地数据，后续可替换为后端 API）
- `src/types`：TypeScript 类型定义
- `public`：静态资源

## 数据与内容说明

当前博客文章存放于：

- `src/data/articles.json`

文章详情页通过 `dangerouslySetInnerHTML` 渲染 `content` 字段（HTML 字符串）。

## 部署到 GitHub Pages（推荐）

项目已内置 GitHub Actions 工作流：

- `.github/workflows/deploy.yml`

部署步骤：

1. 推送代码到 GitHub 仓库的 `main` 分支
2. 打开仓库设置：`Settings -> Pages`
3. 将 **Source** 选择为 **GitHub Actions**
4. 等待 `Actions` 中的 `Deploy to GitHub Pages` 工作流执行完成

路由说明：

- 本项目使用 `HashRouter`，因此页面路由形如：`/#/blog`、`/#/about`

## 后续计划

- 将 `src/api/index.ts` 中的本地数据替换为 `fetch('/api/...')` 对接 Spring Boot
- 文章内容可选：Markdown + 脚本生成 JSON（或自建管理端）

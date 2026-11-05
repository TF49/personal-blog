# 涂家乐 · 个人博客（personal-blog）

基于 React + Vite + TypeScript + Tailwind CSS 的个人博客前端。

视觉与动效以 Max Milkin 的作品集为主要参照：鼠尾草绿与近黑两色交替分区、大量留白、字母环加载页、关于段落的字母聚拢、首屏 3D 石头。完整的设计说明、取舍和实施记录见 [`docs/redesign/DESIGN.md`](docs/redesign/DESIGN.md)。

## 在线预览

- `https://tf49.github.io/personal-blog/`

## 页面

- **首页**：字母环加载页（每个会话一次，可跳过）、3D 石头首屏、关于段落、最新 6 篇文章
- **文章列表**（`/blog`）：分类筛选、两列文章索引、悬停预览
- **文章详情**（`/blog/:slug`）：17px 正文阅读版式、阅读进度条、代码复制、相关文章
- **关于**（`/about`）：简介与联系方式、经历时间线、GitHub 精选仓库、技术栈

## 技术栈

- **框架**：React 18
- **构建**：Vite 5
- **语言**：TypeScript
- **样式**：Tailwind CSS 3 + CSS 变量设计令牌（`src/index.css`）
- **路由**：React Router 6（`BrowserRouter`，配合 `public/404.html` 适配 GitHub Pages）
- **动效**：GSAP（ScrollTrigger、MotionPath）+ Lenis 平滑滚动
- **3D**：Three.js，首屏按需加载
- **图标**：Phosphor Icons
- **字体**：Inter Tight、Noto Sans SC、JetBrains Mono，均通过 fontsource 自托管

## 本地运行

```bash
npm install
npm run dev
```

开发地址：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

构建产物输出到 `dist/`。

`npm run build` 会先运行 `scripts/generate-seo-files.mjs` 生成 `public/sitemap.xml` 与 `public/robots.txt`。本地构建时站点地址默认为 `http://localhost/`，这两个文件的改动不要提交，CI 会用正式地址重新生成。

## 目录结构

- `src/pages`：Home / Blog / BlogPost / About
- `src/components/site`：新设计的组件（导航、分区色调、加载页、首屏、字母聚拢、文章索引、时间线、仓库列表等）
- `src/components/site/hero/rockScene.ts`：首屏 3D 场景（纯 Three.js，懒加载）
- `src/components`：布局、页脚、SEO、路由切换、提示条
- `src/data`：本地数据（个人资料、技术栈、时间线、精选仓库）
- `src/api`：数据接口（文章读取 `articles.json`，仓库数据请求 GitHub API）
- `src/assets/hero`：首屏静态回退图
- `docs/redesign`：设计文档与截图脚本

## 数据与内容

博客文章来自 GitHub Issues（仓库 `TF49/blog-content`，标签 `blog`），由 `npm run generate:articles` 生成到 `public/articles.json`。前端运行时从站点根目录加载该文件，文章详情页把 `content` 字段（HTML）经 DOMPurify 消毒后渲染。

Issue 正文按 Markdown 解析：标题请用 `##`，代码请用三个反引号围起来，否则会被当作普通段落显示。frontmatter 可写 `slug`、`date`、`summary`、`category`、`cover`。

关于页的精选仓库在 `src/data/featuredRepos.ts` 配置。GitHub API 请求失败时使用同文件里的本地数据，此时不显示星标数。

## 首屏 3D 与回退图

首屏 3D 场景在以下情况不加载，改为显示静态回退图：视口宽度小于 768px、系统开启“减少动态效果”、不支持 WebGL2、开启省流量模式、预渲染。

回退图由 `docs/redesign/tools/capture-hero.mjs` 从 3D 场景截取。修改场景后按该脚本顶部的说明重新生成。

## 部署到 GitHub Pages

项目内置 GitHub Actions 工作流 `.github/workflows/deploy.yml`：

1. 推送代码到 `main` 分支（推送即部署）
2. 仓库 `Settings -> Pages` 的 **Source** 选择 **GitHub Actions**
3. 等待 `Deploy to GitHub Pages` 工作流完成

路由说明：项目使用 `BrowserRouter`，页面路由形如 `/personal-blog/blog`、`/personal-blog/about`。GitHub Pages 不支持单页应用的路径重写，直接访问子路径时由 `public/404.html` 把路径转给入口页，`index.html` 里的脚本再还原地址。

# 前端重构设计文档

- 状态:**已确认(v1.0)**,可以实施
- 日期:2026-11-04
- 范围:`personal-blog` 全站前端视觉与交互重构
- 实施会话请直接跳到[第 15 节](#15-实施入口给新会话),再回头按需查阅其余章节。
- 本文档本身不包含任何代码改动。"已核实"均指对项目文件、参考站截图和运行状态的实际读取。

## 1. 目标与非目标

### 目标

1. 视觉与动效以 Max Milkin 作品集(maxmilkin.com)为主要参照:鼠尾草绿与近黑两色、大量留白、克制的字母动效。
2. 动效集中在入口(加载页、首页首屏、关于段落),阅读页保持安静,保证长文可读。
3. 保持现有内容管线不变:GitHub Issues → `generate-articles.mjs` → `public/articles.json` → 静态站点 → GitHub Pages。
4. 文章列表借用 Josué Pichot 的"文字索引 + 标签药丸 + 筛选"。

### 非目标

- 不做浅色/深色整站主题切换。页面由"绿底分区"与"黑底分区"交替构成。
- 不新增后端、评论系统、搜索服务。
- 不复制参考站的图片、logo、文案、3D 模型。
- 不改 GitHub Actions 发布流程(`deploy.yml`、`update-articles.yml` 保持原样)。

## 2. 现状(已核实)

| 项 | 现状 |
|---|---|
| 框架 | React 18.3.1 + Vite 5 + TypeScript + Tailwind 3.4 |
| 路由 | `react-router-dom` 6,`BrowserRouter`,`basename={import.meta.env.BASE_URL}`。路由:`/`、`/blog`、`/blog/:slug`、`/about`。README 写的是 `HashRouter`,与代码不符,收尾时更正 |
| 布局 | `Layout` = `ToastProvider` + `SmoothScroll`(Lenis + GSAP ticker)+ `AmbientBackground` + `Header` + `Footer` |
| 现有视觉 | 深色 + 靛蓝(`--color-primary: #6366f1`),Inter 字体,首页由 `components/home/` 下 25 个分区组成 |
| 代码规模 | `src/` 共 68 个文件;`utils/gsapAnimations.ts` 661 行;`index.css` 591 行 |
| 已装动效依赖 | `gsap 3.15.0`(含 `ScrollTrigger`、`SplitText`、`MotionPathPlugin`,已在 `node_modules` 确认)、`@gsap/react`、`lenis 1.3.26`、`framer-motion` |
| 文章数据 | `Article { id, title, slug, summary, content(HTML), category, date, readCount? }`,没有封面字段。`articles.json` 目前 5 篇,分类为"未分类"(3)和"开发笔记"(2)。`readCount` 实际是 **Issue 评论数**(`generate-articles.mjs` 里有注释),不是阅读数 |
| 预渲染 | `vite-plugin-prerender` 仅在 `ENABLE_PRERENDER=true` 时启用;`deploy.yml` 没有设置它。各页面会派发 `prerender-ready` 事件,`api/github.ts` 读取 `__PRERENDER_INJECTED` |
| SEO 文件 | `public/sitemap.xml`、`robots.txt` 由 `npm run build` 的 `prebuild` 生成。未设置 `SITE_URL` 时会写入 `http://localhost/`,工作区里那份 `sitemap.xml` 的改动就是这样来的,CI 会重新生成 |
| 字体 | `index.html` 通过 Google Fonts 在线加载 Bebas Neue、Inter、JetBrains Mono、Noto Sans SC |
| Git | 分支 `main`,工作区有 20 项未提交改动(19 项旧设计文件的修改 + 未跟踪的 `src/components/CommandPalette.tsx`)。**已决定不保留**,处理步骤见 12.1 |

## 3. 参考与取舍

### 3.1 采纳来源

| 来源 | 采纳 | 证据 |
|---|---|---|
| Max Milkin | 配色、字母环加载页、关于页字母聚拢、幽灵大标题、分区编号、两列错落列表、Lenis 平滑滚动、首屏 3D 物体 | 无头浏览器截图(加载页 0%/65%/71%/100% 的帧、关于页中间帧与终帧、作品区空闲与悬停帧);`html` 类含 `lenis lenis-smooth`;页面含 4 个 WebGL2 画布;Codrops 案例文章(2025-12-02)给出加载页与字母聚拢的实现参数 |
| Josué Pichot | 标签药丸、分类筛选 | 截图:作品行旁的描边药丸,底部"Art Direction for Campaigns 18"筛选条 |
| Sean Currlin | 居中窄栏的时间线版式(用于关于页) | 截图:经历区每段一屏、窄栏、日期 + 要点列表 |
| Decart | 不采用 | 仅作列表信息架构的对照 |

### 3.2 与参考站刻意不同的地方

1. **正文字号与字重。** Max 的站正文为 13.5px、字重 300,幽灵字对比度极低,适合展示作品,不适合读长文。本站文章页使用 17px、字重 400。
2. **导航文字颜色。** Max 的导航在首屏是白字,叠在深色石头上才可读。白字在鼠尾草绿上对比度只有 1.69:1,不达标。本站导航在绿底上一律使用墨色。
3. **悬停反馈。** 从两张对比截图推断,Max 的列表在悬停时被悬停项变灰、中间出现预览图。这只是推断,没有采集到动画过程。本站改为:被悬停或聚焦的项保持高亮,其余项降到 40% 不透明度。
4. **字体。** Max 用 RF Dewi,Josué 用 Neue Haas Grotesk,均为商业字体,不使用。

### 3.3 未验证项

- 各站的手机端表现、触摸交互。
- Max 站的路由切换动画(截图只覆盖了单页滚动)。
- 首屏 3D 物体的实时交互(鼠标、滚动联动)细节。
- Josué 底部筛选条点击后是否真的过滤列表。

## 4. 信息架构与页面

保持现有 4 条路由,不新增路由。

```
/            首页:加载页 → 首屏 → 关于(字母聚拢)→ 最新文章 → 页脚
/blog        文章列表:标签筛选 + 两列错落索引 + 悬停预览
/blog/:slug  文章详情:安静的阅读版式
/about       关于:简介、时间线、技术栈、GitHub 精选仓库
```

### 4.1 首页分区

| 序号标签 | 分区 | 背景 | 内容 |
|---|---|---|---|
| — | 首屏 | 鼠尾草绿 | 3D 物体、右对齐错行标语、导航 |
| `( ABOUT. )` `[ N.001 ]` | 关于 | 近黑 | 幽灵大标题、头像、字母聚拢段落、"关于我"药丸链接 |
| `( POSTS. )` `[ N.00x ]` | 最新文章 | 近黑 | 最近 6 篇,两列错落索引,"全部文章"链接 |
| `( CONTACT. )` | 页脚 | 鼠尾草绿 | 邮箱、社交链接、返回顶部 |

`N.00x` 中的数字取实际文章数量。标签格式沿用 Max:圆括号标题在中间,方括号编号在右上。

### 4.2 导航

- 站名:**涂家乐**。
- 桌面:左侧站名,右侧 `首页 / 文章 / 关于` 三个链接,高度 64px,字号 13px。
- 手机:右上角菜单按钮,展开为近黑全屏层,链接字号 28px。
- 当前页链接显示 1px 下划线。
- 所有可点击元素最小 44×44 px 触控区域。

### 4.3 关于页

1. 简介(`profile.bio`)与联系方式。
2. 时间线(`timelineEvents`),居中窄栏,宽约 670px,每段含年份、标题、描述。
3. 技术栈(`techStackByCategory`),按分类分组的纯文字列表,不用 logo 墙。
4. **GitHub 精选仓库**(`getPinnedRepos`):名称、描述、语言、星标数。请求失败时整块隐藏,不显示错误占位,不影响其余内容。
5. 社交链接。

## 5. 视觉系统

### 5.1 颜色(CSS 变量,Tailwind 映射到同名语义色)

| 令牌 | 值 | 来源 |
|---|---|---|
| `--sage` | `#C2CABB` | 实测 `rgb(194,202,187)`,Max 站 `body` 背景 |
| `--ink` | `#10120F` | 实测 `rgb(16,18,15)`,Max 站文字色;同时用作黑色分区背景 |
| `--on-sage` | `var(--ink)` | 绿底上的文字 |
| `--on-ink` | `var(--sage)` | 黑底上的文字 |
| `--on-sage-muted` | ink 70% 混合 | 次要文字,下限 70% |
| `--on-ink-muted` | sage 70% 混合 | 次要文字,下限 70% |
| `--line-sage` | ink 24% | 绿底分隔线 |
| `--line-ink` | sage 28% | 黑底分隔线 |
| `--ghost` | 白 4% 混入 ink | 仅用于幽灵大标题,装饰性 |

除上表外不引入第三种色相。强调用"反色":绿底上用墨色填充,黑底上用鼠尾草绿填充。

#### 对比度(脚本计算,WCAG 相对亮度公式)

| 前景 / 背景 | 对比度 | 用途 |
|---|---|---|
| 墨色 / 鼠尾草绿 | 11.17:1 | 绿底正文 |
| 鼠尾草绿 / 墨色 | 11.17:1 | 黑底正文 |
| 墨色 70% / 鼠尾草绿 | 5.45:1 | 绿底次要文字,达标 |
| 鼠尾草绿 70% / 墨色 | 5.97:1 | 黑底次要文字,达标 |
| 墨色 60% / 鼠尾草绿 | 4.07:1 | **不达标**,禁止使用 |
| 白 / 鼠尾草绿 | 1.69:1 | **不达标**,禁止使用 |
| `--ghost` / 墨色 | 1.09:1 | 刻意极低,仅限装饰且 `aria-hidden` |

### 5.2 字体

| 角色 | 字体 | 说明 |
|---|---|---|
| 拉丁文 UI、标题、序号标签 | Inter Tight(`@fontsource-variable/inter-tight`) | 替代 RF Dewi,字形紧凑 |
| 中文(含站名"涂家乐") | Noto Sans SC(`@fontsource-variable/noto-sans-sc`,按 unicode-range 分片) | 站名用字重 700、字距 0.04em |
| 代码 | JetBrains Mono | 沿用 |

不使用 Bebas Neue:它只有拉丁字符,而站名已确定为中文"涂家乐",序号标签用 Inter Tight 即可。

字体改为 npm 包自托管,不再从 Google Fonts 在线加载。原因:中文读者访问 `fonts.googleapis.com` 可能不稳定,且在线字体会让首屏文字闪烁。该判断是风险评估,没有做实测。

#### 字号与行高

| 令牌 | 桌面 | 手机 | 行高 | 用途 |
|---|---|---|---|---|
| `display` | 160px | 72px | 0.95 | 幽灵大标题(装饰) |
| `h1` | 56px | 36px | 1.1 | 页面主标题 |
| `h2` | 32px | 24px | 1.2 | 区块标题 |
| `body-lg` | 17px | 17px | 1.85 | **文章正文** |
| `body` | 15px | 15px | 1.7 | 列表、说明 |
| `label` | 13px | 13px | 1.4 | 导航、药丸、序号,字距 0.02em |

中文没有大小写,Max 的"全大写"规则只对拉丁文生效(`text-transform: uppercase` 仅用在拉丁标签上)。中文标题不收紧字距。

### 5.3 间距与版式

- 间距基于 4px,常用档:8 / 16 / 24 / 32 / 48 / 96。
- 内容宽度 1230px,两侧留白 `clamp(20px, 7.3vw, 105px)`(Max 在 1440 宽时左右各 105px)。
- 文章正文栏宽 720px。
- 圆角:药丸 `999px`,图片 `4px`,其余不加圆角。
- 图标统一使用 Phosphor(`@phosphor-icons/react`),线性,描边 1.5px。需要的图标不超过 6 个:ArrowUpRight、ArrowRight、List、X、GithubLogo、EnvelopeSimple。

### 5.4 响应断点

375 / 768 / 1024 / 1440。1024 以下两列错落列表改为单列。

## 6. 动效规范

通用规则:

- 微交互 150–300ms,入场/转场不超过 1.2s,除"加载页"外不出现超过 2s 的动画。
- 缓动:入场用 `power4.out`,位移转场用 `power4.inOut`(取自 Codrops 案例)。
- 所有动画尊重 `prefers-reduced-motion: reduce`:直接显示终态,不播放。
- 动画只改 `transform` 与 `opacity`,不触发布局。

| 名称 | 触发 | 实现 | 参数 | 降级 |
|---|---|---|---|---|
| 平滑滚动 | 全站 | 沿用现有 Lenis + GSAP ticker | `duration 1.2`(沿用) | reduced-motion 下关闭 `smoothWheel` |
| 加载页 | 本会话首次进入 `/` | Canvas 2D 绘制字母环 + GSAP 时间线 | 见 6.1 | reduced-motion、预渲染、深链进入文章页时不播放 |
| 首屏标语 | 加载页结束后 | `SplitText` 按行,位移 + 透明度 | 每行 stagger 0.08s,0.6s | 直接显示 |
| 分区背景切换 | 滚动 | ScrollTrigger 切换分区 class,背景色硬边切换 | 无渐变 | 同左 |
| 幽灵大标题 | 滚动进入关于分区 | ScrollTrigger scrub,按行横向位移 | `scrub: 1` | 静态显示 |
| 字母聚拢 | 滚动关于分区 | GSAP + `MotionPathPlugin` + ScrollTrigger scrub | 见 6.2 | 手机和 reduced-motion 改为整段淡入 |
| 列表悬停预览 | 鼠标悬停 / 键盘聚焦 | React 状态 + CSS transition | 预览淡入 200ms,其余项降到 40% | 触屏无预览,点击直接跳转 |
| 路由切换 | 路由变化 | 保留现有 `PageTransition`,改为 300ms 交叉淡入;切换后 Lenis 回到顶部 | — | 无动画 |

### 6.1 加载页

参考值来自 Codrops 对 Max 站加载页的拆解(PixiJS 实现),本站改用 Canvas 2D,因为字母总数只有几十个,不需要 PixiJS。

- 画布 `position: fixed`,铺满视口,背景 `--sage`,z-index 最高。
- 6 个词,每个词一圈。圈半径 `80 + i × 18`(px),字号 16px,字重 600,颜色 `--ink`。圈的旋转速度 `0.0002 + i × 0.0003`(弧度/帧)。
- 每个字符沿圆弧排布,弧长随时间呼吸:`extent = π + sin(t − offset) × 0.5`。
- 词表(已确认):`涂家乐`、`TF49`、`BLOG`、`NOTES`、`CODE`、`WRITING`。
- 时间线:各圈淡入(stagger 0.12s)→ 中间计数 0→100(1.4s,线性,**按计时走,不假装是真实加载进度**)→ 各圈淡出(0.8s)。总时长约 2.5s,加上退出不超过 3.5s。
- 可跳过:点击、`Enter`、`Esc` 任一即可。
- 每会话一次:`sessionStorage["tf49:intro-seen"]`。
- 无障碍:加载层 `aria-hidden="true"`,页面内容始终在 DOM 里,不被加载层阻塞抓取和读屏。
- 我在软件渲染的无头 Chrome 里观察到 Max 站加载到 100% 约需 12 秒。该数据受环境影响,不代表真机,但说明必须自己控制时长。

### 6.2 字母聚拢(关于段落)

按 Codrops 对 Max 站该效果的拆解实现,两层 DOM:

- 目标层:最终段落,每个字符是一个 `span`,初始 `opacity: 0`,位置即最终排版。
- 飞行层:左右两列的"飞行字母",按组排布。
- 一条 GSAP 时间线由 ScrollTrigger 驱动:`start: "50% 100%"`,`end: "50% -10%"`,`scrub: 1`。
- 每个飞行字母沿三点路径(起点、控制点、终点)运动,`curviness: 0.85`,控制点横向偏移 ±90px、纵向 +160px,每个字母起始间隔 0.025s。
- 飞行字母在接近终点时淡出,目标字符在进度 >0.65 时淡入,避免像素对不齐。
- 中文以单个汉字为单位。限制:段落不超过 120 字,总 DOM 节点不超过 240 个。
- 读屏:飞行层 `aria-hidden="true"`,目标段落是真实文本。

## 7. 首屏 3D

### 7.1 方案

- 一个 Three.js 场景,物体为程序化生成的石头:二十面体细分后用噪声位移,漫反射 + 粗糙度程序纹理,单个方向光 + 环境光,地面接收柔和阴影,背景和雾色使用 `--sage`。
- 为什么程序化:Max 的石头来自 Blender 烘焙模型,我拿不到,且不应复制。
- 交互:鼠标移动时相机缓动环绕(参考 Codrops 的相机环绕写法,插值系数 0.05);滚动时物体轻微上移。
- 标语(右对齐、错行)叠在物体上。**文字必须压在物体深色部分之上**,否则达不到对比度;若实现中发现文字落到亮部,改为墨色并移位。

### 7.2 加载与降级

- `three` 通过动态 `import()` 懒加载,不进入主包。
- 以下任一条件成立时不加载 3D,改用静态回退图(从场景截图生成的 WebP)加轻微 CSS 视差:
  - 视口宽度 < 768px
  - `prefers-reduced-motion: reduce`
  - 不支持 WebGL2
  - `navigator.connection.saveData === true`
  - 正在预渲染(`__PRERENDER_INJECTED`)
- 标签页不可见或首屏滚出视口时暂停渲染(`IntersectionObserver` + `visibilitychange`)。
- 预算(目标,需实测):三角面 ≤ 30k,`devicePixelRatio` 上限 2,单个画布。
- 实施顺序:P3 先用静态回退图占位,P4 再接入场景并从场景截图生成最终回退图。

## 8. 组件清单

### 8.1 新建

| 组件 | 说明 |
|---|---|
| `IntroLoader` | 字母环加载页 |
| `SiteHeader` / `SiteNav` | 新导航,含手机全屏菜单 |
| `SectionLabel` | `( ABOUT. )` 与 `[ N.002 ]` 标签 |
| `HeroScene` | Three.js 场景,懒加载 |
| `HeroFallback` | 静态回退图 + CSS 视差 |
| `GhostHeading` | 装饰性大标题 |
| `LetterAssembly` | 字母聚拢 |
| `PostIndex` | 两列错落文章索引 |
| `PostPreview` | 悬停预览,封面缺失时渲染"排版卡片"(分类 + 日期 + 标题) |
| `TagPill` / `FilterBar` | 描边药丸与筛选条 |
| `ArticleBody` | 文章正文排版(标题、引用、代码块、图片) |
| `Timeline` | 居中窄栏时间线 |
| `RepoList` | 关于页的 GitHub 精选仓库 |
| `useReducedMotion` | 统一读取 `prefers-reduced-motion` 的 hook |

### 8.2 改造

`Layout`(移除 `AmbientBackground`)、`SmoothScroll`(增加 reduced-motion 分支)、`PageTransition`、`Footer`、`SEO`、`Home` / `Blog` / `BlogPost` / `About` 四个页面。

### 8.3 删除(已确认,在 P5 执行)

- `components/home/` 全部 25 个文件
- `components/reactbits/`、`components/effects/AmbientBackground.tsx`、`components/CustomCursor.tsx`
- `components/CommandPalette.tsx`(未跟踪文件,P0 的 stash 已一并收走;如被 `Header.tsx` 引用,随 `Header` 重写一并消失)
- `utils/gsapAnimations.ts`(661 行,由少量新的动效辅助函数取代)
- `data/highlights.ts`、`data/stats.ts`(首页不再使用)
- 依赖:`framer-motion`、`lucide-react`(仅当代码里不再引用)

删除前一律用全局引用检查,分阶段删除,每次删除后构建验证。

## 9. 数据与接口

### 9.1 文章类型与生成脚本

`Article` 增加一个可选字段(已确认):

```ts
cover?: string   // 封面图地址;缺失时前端渲染排版卡片
```

`scripts/generate-articles.mjs` 的实现方式:读取 frontmatter 的 `cover`;没有则取 `md.render()` 结果里第一张 `<img>` 的 `src`;都没有则不输出该字段。脚本已完整读过,返回对象目前是 `{ id, title, slug, summary, content, category, date, readCount }`,在这里加一个键即可。

**`readCount` 是评论数。** 界面不显示"阅读数"。如需展示,标签写"评论 N"。

阅读时长由前端按正文长度估算,不落库。

### 9.2 API

- 保留:`getArticles`、`getArticleBySlug`、`getRecentArticles`、`getRecommendedArticles`、`getProfile`、`getTimeline`、`getTechStack`、`getPinnedRepos`。
- 首页不再请求 GitHub API(原 `getHomeSnapshot` 会请求 pinned repos),减少首屏的一个运行时失败点。GitHub 仓库只在关于页请求。
- 关于页的仓库列表沿用 `data/featuredRepos.ts` 的配置;请求失败时隐藏整块(见 4.3)。未认证的 GitHub API 请求有速率限制,所以结果要缓存在模块内,同一会话只请求一次。
- `getCategories()` 目前恒返回 `[]`(代码注释已说明),筛选条的分类改为从 `getArticles()` 结果推导。

## 10. 技术决策

| 决策 | 选择 | 理由 |
|---|---|---|
| 框架 | 保持 React + Vite + Tailwind | 项目已具备,GSAP/Lenis 已装,Max 的站也用同类库 |
| 样式 | Tailwind + CSS 变量令牌 | 令牌集中在 `:root`,Tailwind 只引用语义色 |
| 动效 | GSAP(ScrollTrigger / SplitText / MotionPath)+ Lenis | 3.15 版本已含所需插件 |
| 3D | `three` 原生 + 动态导入 | 单个场景不需要 `@react-three/fiber` 这一层 |
| 路由 | 保持 `BrowserRouter` | 现状;`index.html` 里已有 GitHub Pages 的 `?p=` 回退脚本 |
| 字体 | npm 自托管 | 见 5.2 |
| 图标 | Phosphor | 项目规则的默认图标库 |
| 加载页画布 | Canvas 2D | 字符量小,不引入 PixiJS |

新增依赖:`three`、`@types/three`(dev)、`@fontsource-variable/inter-tight`、`@fontsource-variable/noto-sans-sc`、`@phosphor-icons/react`。版本均已在 npm 上核实存在(three 0.187.0、`@phosphor-icons/react` 2.1.10、字体包 5.x),且与 React 18 兼容。JetBrains Mono 的自托管包在实施时按同样方式选 `@fontsource/jetbrains-mono`,先 `npm view` 核实再装。

## 11. 性能、无障碍、SEO

### 性能目标(需构建后实测)

- 核心网页指标"良好"阈值:LCP ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms。
- 首屏主包不含 `three`;`three` 与场景代码单独成块,仅在满足 7.2 条件时加载。
- 字体按 unicode-range 分片,`font-display: swap`。
- 图片:WebP,明确宽高,首屏以外 `loading="lazy"`。

### 无障碍

- 全站 `prefers-reduced-motion` 支持。
- 键盘:所有交互可用 Tab 到达,聚焦环 2px,颜色为当前背景的反色。列表项聚焦等同悬停(显示预览)。
- 提供"跳到正文"链接。
- 装饰元素(幽灵标题、飞行字母、加载层)均 `aria-hidden`。
- 文字对比度见 5.1 表格。

### SEO 与预渲染

- 任何动画都不能让正文在 DOM 中缺席。加载层、飞行层只是叠加层。
- 保留各页面派发的 `prerender-ready` 事件和 `__PRERENDER_INJECTED` 判断;加载页和 3D 在预渲染时跳过。
- 现状下 CI 未设置 `ENABLE_PRERENDER`,因此线上目前是客户端渲染。是否在 CI 启用预渲染不在本次范围,单独评估。
- `SEO.tsx`、`sitemap.xml`、`robots.txt` 沿用。`index.html` 的 `<title>` 与描述改为以"涂家乐"为主,去掉旧文案里的"(TF49)"以外的冗余副标题,具体措辞实施时给你确认。

## 12. 分阶段计划与验收

每个阶段都应能独立通过 `npm run build`(即 `tsc -b && vite build`)并可部署。每个阶段完成后单独提交。

### 12.1 P0 准备(含 git 操作,逐步执行)

目标:从干净的 `main` 出发,在新分支上开工,旧设计改动可恢复但不参与重构。

1. **先提交设计文档。** 文档目录 `docs/` 当前是未跟踪文件,如果直接 `git stash -u` 或 `git clean` 会连同文档一起清掉。
   - `git switch -c redesign/max-style`(未提交改动会跟着带过去)
   - `git add docs/redesign/DESIGN.md docs/redesign/tools .gitignore`
   - `git commit -m "docs(redesign): 添加前端重构设计文档"`
   - `docs/redesign/reference/` 已被 `.gitignore` 忽略(第三方截图,仅本地使用)。
2. **收走旧设计改动。** 你已确认不保留这 20 项,但仍用 stash 而不是硬丢弃,留一道可恢复的保险:
   - `git stash push -u -m "old-design-discarded" -- index.html public/sitemap.xml src tailwind.config.js`
   - `-u` 会把未跟踪的 `src/components/CommandPalette.tsx` 一并收走。
   - 执行后 `git status` 应当干净。若不干净,先弄清剩余项是什么,不要继续。
   - P1 验收通过后,由你决定是否 `git stash drop`。
3. **验证基线可构建。** `npm ci` → `npm run build`。基线构建失败的话,先弄清原因再动手,否则后面无法区分是谁引入的问题。构建会改写 `public/sitemap.xml`、`public/robots.txt`(写入 `localhost`),提交前用 `git restore public/sitemap.xml public/robots.txt` 还原,不要把本地地址提交进去。
4. **安装依赖。** 见第 10 节。装之前对每个包先 `npm view <name> version` 核实。
5. **字体自托管。** 删除 `index.html` 里的 Google Fonts 外链,在入口 CSS 里引入 fontsource 包。

验收:`git status` 干净(除新增依赖相关改动);构建通过;`index.html` 不再含 `fonts.googleapis.com`。

### 12.2 各阶段

| 阶段 | 内容 | 验收 |
|---|---|---|
| P0 准备 | 见 12.1 | 见 12.1 |
| P1 基础 | 令牌与 Tailwind 映射、新 `Layout` / 导航 / 页脚、分区背景切换、路由切换 | 四个页面均能打开,导航可用,375/768/1440 无横向滚动条 |
| P2 文章 | `PostIndex` + 筛选 + 悬停预览;`ArticleBody` 阅读版式;`cover` 字段与脚本改动 | 筛选可用;键盘聚焦可出预览;文章页 17px 正文,对比度达标;没有封面的文章显示排版卡片 |
| P3 首页 | 加载页、首屏(先用静态回退图)、`LetterAssembly`、最新文章 | 加载页可跳过且每会话一次;关闭动画后首页内容完整 |
| P4 3D | `HeroScene` 懒加载 + 降级条件 + 从场景截图生成回退图 | 满足 7.2 任一降级条件时不请求 `three` 块;帧率与包体积有实测记录 |
| P5 关于与收尾 | `About`(时间线、技术栈、精选仓库)、删除 8.3 节的文件、更新 README、a11y 与性能复查 | 无死代码引用;README 与实际路由、技术栈一致 |

### 12.3 验证方法

沿用本次调研用的无头 Chrome 截图,脚本在 `docs/redesign/tools/shoot.mjs`,用法见第 15 节。每阶段在 375 / 768 / 1024 / 1440 四个宽度各拍一组,并分别在开启和关闭 `prefers-reduced-motion` 下检查。

## 13. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| 旧设计改动被误恢复或误提交 | 重构基线被污染 | 按 12.1 在新分支上 stash;P1 通过前不 drop |
| `git stash -u` 误收文档 | 设计文档丢失 | 12.1 第 1 步先提交文档 |
| 本地构建把 `localhost` 写进 `sitemap.xml` | 错误链接被提交 | 提交前 `git restore` 两个 SEO 文件(见 12.1 第 3 步) |
| 中文排版与参考站的拉丁字体风格不一致 | 紧字距、全大写、超大字号照搬会显得别扭 | 大字号只用于拉丁/短词;中文标题字距不收紧;文章正文单独规范 |
| 字母聚拢的 DOM 数量 | 中文段落过长会拖慢滚动 | 限制 120 字、240 节点;手机降级 |
| 软件渲染环境下 3D 帧率不代表真机 | 误判性能 | 性能数据以真机为准;降级条件保守 |
| 字体包体积 | 中文字体较大 | 分片加载,按页面实际用到的字符区块请求 |
| 删除范围大(`components/home/` 等) | 误删仍被引用的文件 | 删除前用全局引用检查,分阶段删除,每次构建验证 |
| GitHub API 速率限制 | 关于页仓库列表偶发失败 | 模块内缓存;失败时隐藏整块 |
| 参考站版权 | 复制素材有侵权风险 | 只借鉴版式、字号层级、色彩关系和交互模式,素材全部自制;参考截图不提交 |
| 参考站交互细节未完全验证(3.3 节) | 实现可能与预期有出入 | 每阶段完成后截图对比,必要时调整 |

## 14. 已确认的决策

| # | 问题 | 决定 |
|---|---|---|
| 1 | 工作区 20 项未提交改动 | 不保留。用 stash 收走(见 12.1),P1 验收后再决定是否丢弃 |
| 2 | 站名 | 涂家乐 |
| 3 | `CommandPalette` | 删除(设计内没有对应功能) |
| 4 | `Article.cover` | 增加可选字段;缺失时用排版卡片 |
| 5 | 关于页 GitHub 精选仓库 | 展示,失败时隐藏 |
| 6 | 加载页词表 | `涂家乐 / TF49 / BLOG / NOTES / CODE / WRITING` |
| 7 | 首屏 3D | 程序化 Three.js 石头,懒加载,多种条件降级 |
| 8 | Josué / Decart 的角色 | Josué 只取标签药丸与筛选;Decart 不采用 |
| 9 | 整站深色主题切换 | 不做 |
| 10 | Bebas Neue | 不使用(站名为中文,序号标签用 Inter Tight) |

## 15. 实施入口(给新会话)

### 唯一依据

**`docs/redesign/DESIGN.md`**(本文件)。其余文件都是它的补充:

| 路径 | 内容 | 是否提交 |
|---|---|---|
| `docs/redesign/reference/` | 10 张参考站截图(Max 7 张、Josué 3 张),文件名即内容 | 否(已加入 `.gitignore`) |
| `docs/redesign/tools/shoot.mjs` | 无头 Chrome 滚动截图脚本 | 是 |

`reference/` 里的文件:`max-loader-71pct`、`max-hero`、`max-about-assembling`、`max-about-final`、`max-works-idle`、`max-works-hover`、`max-contact`、`jozue-hero`、`jozue-index-filter`、`jozue-footer-cta`(均为 `.png`)。截图是在 1440×900 下用软件渲染的无头 Chrome 拍的。

### 开始前

1. 通读第 2、5、6、12 节。
2. 从第 12.1 节的 P0 开始,**按顺序**做,每一步确认结果再继续。
3. 动手前先读,不要凭印象改:`src/App.tsx`、`src/components/Layout.tsx`、`src/components/effects/SmoothScroll.tsx`、`src/api/index.ts`、`src/api/github.ts`、`scripts/generate-articles.mjs`、`vite.config.ts`、`index.html`。

### 约束

- 不改 `.github/workflows/*`。`generate-articles.mjs` 只允许增加 `cover` 字段的输出。
- 保留各页面里的 `prerender-ready` 事件派发。
- 不复制参考站的任何图片、文案、模型。
- 安装任何依赖前先 `npm view <包名> version` 核实。
- 每个阶段构建通过后单独提交。仓库现有提交风格是 `类型(范围): 中文描述`,例如 `fix(ci): 修复 generate-articles 401 错误`。
- 视觉验证用截图,不要只看构建是否通过。

### 截图脚本用法

`shoot.mjs` 依赖 `puppeteer-core`,不要装进项目。在临时目录里装:

```powershell
$d = "$env:TEMP\shotrunner"; New-Item -ItemType Directory -Force $d | Out-Null
Copy-Item docs\redesign\tools\shoot.mjs $d\
cd $d; npm init -y; npm i puppeteer-core
# 先在项目里启动开发服务器(npm run dev),再:
node shoot.mjs "http://localhost:5173/" home 1440 900 12 5000
```

参数依次为:地址、输出名前缀、宽、高、最多截几张、首屏前等待毫秒数。输出在 `%TEMP%\shots\`。脚本里 Chrome 路径写死为 `C:\Program Files\Google\Chrome\Application\chrome.exe`。脚本不模拟 `prefers-reduced-motion`,检查降级时在脚本里加 `page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])`。

### 建议的开场提示词

> 请阅读 `docs/redesign/DESIGN.md`,按第 12.1 节执行 P0。先不要写任何业务代码。每一步执行后告诉我结果,P0 全部通过后再进入 P1。

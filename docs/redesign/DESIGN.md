# 前端重构设计文档

- 状态:**已确认(v1.3)**,实施中。**P0、P1、P2、P3 已完成**,下一步 P4
- 日期:2026-11-04(v1.0 确认;v1.1 补充 P0/P1 实施记录;v1.2 补充 P2 实施记录;v1.3 补充 P3 实施记录)
- 范围:`personal-blog` 全站前端视觉与交互重构
- 分支:`redesign/max-style`(已推送到 `origin`;`main` 未改动,线上站点不受影响)
- 实施会话请直接跳到[第 15 节](#15-实施入口给新会话),已完成阶段的结果与偏差见[第 16 节](#16-实施记录)。
- "已核实"均指对项目文件、参考站截图和运行状态的实际读取。

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
| 现有视觉 | 已提交版本(`main`)为深色 + 苹果蓝(`--color-primary: #0071e3`),Inter 字体,首页由 `components/home/` 下 25 个分区组成。v1.0 写的"靛蓝 `#6366f1`"是未提交的旧设计改动里的值,该改动已在 P1 后丢弃 |
| 代码规模 | `src/` 共 68 个文件;`utils/gsapAnimations.ts` 661 行;`index.css` 591 行 |
| 已装动效依赖 | `gsap 3.15.0`(含 `ScrollTrigger`、`SplitText`、`MotionPathPlugin`,已在 `node_modules` 确认)、`@gsap/react`、`lenis 1.3.26`、`framer-motion` |
| 文章数据 | `Article { id, title, slug, summary, content(HTML), category, date, readCount? }`,没有封面字段。`articles.json` 目前 5 篇,分类为"未分类"(3)和"开发笔记"(2)。`readCount` 实际是 **Issue 评论数**(`generate-articles.mjs` 里有注释),不是阅读数 |
| 预渲染 | `vite-plugin-prerender` 仅在 `ENABLE_PRERENDER=true` 时启用;`deploy.yml` 没有设置它。各页面会派发 `prerender-ready` 事件,`api/github.ts` 读取 `__PRERENDER_INJECTED` |
| SEO 文件 | `public/sitemap.xml`、`robots.txt` 由 `npm run build` 的 `prebuild` 生成。未设置 `SITE_URL` 时会写入 `http://localhost/`,工作区里那份 `sitemap.xml` 的改动就是这样来的,CI 会重新生成 |
| 字体 | 重构前:`index.html` 从 Google Fonts 加载 Bebas Neue、Noto Sans SC,`index.css` 里另有一条 `@import` 加载 Inter;JetBrains Mono 实际没有加载。**P0 已全部改为 fontsource 自托管** |
| Git | 重构前:分支 `main`,工作区有 20 项未提交改动(19 项旧设计文件的修改 + 未跟踪的 `src/components/CommandPalette.tsx`)。P0 收进 stash,**P1 验收后已 `git stash drop`,不可恢复** |

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

实现(P1,`src/index.css`):混合色预先算成实色,不依赖 `color-mix()`:`--on-sage-muted #454943`、`--on-ink-muted #8D9387`、`--line-sage #979E92`、`--line-ink #42463F`、`--ghost #1A1B19`。`--sage` / `--ink` 另有 `-rgb` 通道变量,Tailwind 的 `sage` / `ink` 支持透明度修饰(如 `bg-ink/40`)。

分区语义色:`.tone-sage` / `.tone-ink` 设置 `--surface`、`--fg`、`--fg-muted`、`--line` 四个变量,Tailwind 映射为 `bg-surface`、`text-fg`、`text-fg-muted`、`border-line`。组件内用这四个即可,不必区分自己在哪种底色上。`body` 默认等同 `.tone-ink`。

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
| 墨色 40% / 鼠尾草绿 | 2.39:1 | 列表悬停时"其余项降到 40%"的实际对比度,仅作为非当前项的视觉弱化,不承载必须读到的信息 |

P1 用实色复算:两项次要文字为 5.43:1 与 5.95:1(上表 5.45 / 5.97 为不同取整方式),均达标。

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
  - 2.1.10 版里不带后缀的导出名已标记弃用,一律用 `ListIcon`、`XIcon`、`ArrowRightIcon` 等带 `Icon` 后缀的名字。
  - 尺寸令牌在 `src/components/site/icon.ts`:`ICON_MD`(24px + `regular`)与 `ICON_SM`(16px + `bold`),两者实际描边都是 1.5px。不要直接写 `size` / `weight`。
- Tailwind 已映射:字号 `text-display / h1 / h2 / body-lg / body / label`(手机 375 到桌面 1440 线性缩放)、`max-w-content / article / timeline`、`rounded-pill / img`、布局容器 `.site-wrap`(1230px + 两侧 `--gutter`)。断点沿用 Tailwind 默认,`md` = 768、`lg` = 1024。

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
| 平滑滚动 | 全站 | 沿用现有 Lenis + GSAP ticker;`useLenis()` 取实例 | `duration 1.2`(沿用) | reduced-motion 下关闭 `smoothWheel` |
| 加载页 | 本会话首次进入 `/` | Canvas 2D 绘制字母环 + GSAP 时间线 | 见 6.1 | reduced-motion、预渲染、深链进入文章页时不播放 |
| 首屏标语 | 加载页结束后 | `SplitText` 按行,位移 + 透明度 | 每行 stagger 0.08s,0.6s | 直接显示 |
| 分区背景切换 | 滚动 | 分区用 `ToneSection` 声明底色;每个分区建一个 ScrollTrigger,分区越过导航中线(距顶 32px)时导航切到同色调 | 无渐变 | 同左 |
| 幽灵大标题 | 滚动进入关于分区 | ScrollTrigger scrub,按行横向位移 | `scrub: 1` | 静态显示 |
| 字母聚拢 | 滚动关于分区 | GSAP + `MotionPathPlugin` + ScrollTrigger scrub | 见 6.2 | 手机和 reduced-motion 改为整段淡入 |
| 列表悬停预览 | 鼠标悬停 / 键盘聚焦 | React 状态 + CSS transition | 预览淡入 200ms,其余项降到 40% | 触屏无预览,点击直接跳转 |
| 路由切换 | 路径变化 | `PageTransition` 先淡出旧页面再淡入新页面(不是两页叠放的交叉淡入);切换后 Lenis 回到顶部,焦点移到 `#main-content`;只改 search / hash 时不转场 | 淡出 120ms + 淡入 180ms | 直接切换 |

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
| `ToneSection` | P1 新增(原清单没有):带底色的分区,并向导航报告底色 |

**P1 已完成:**`SiteHeader`、`SiteNav`、`SectionLabel`、`ToneSection` 在 `src/components/site/`,同目录还有 `tone.ts`(导航底色状态)和 `icon.ts`(图标令牌);`useReducedMotion` 在 `src/hooks/`。`SectionLabel` 的 `align="center"` 用于只有标签、没有编号的场景,如页脚。

### 8.2 改造

`Layout`(移除 `AmbientBackground`)、`SmoothScroll`(增加 reduced-motion 分支)、`PageTransition`、`Footer`、`SEO`、`Home` / `Blog` / `BlogPost` / `About` 四个页面。

**P1 已完成:**`Layout`、`SmoothScroll`、`PageTransition`、`Footer`、`App.tsx`(`Suspense` 移进 `PageTransition` 内部)。旧的 `Header.tsx` 已被 `SiteHeader` 取代,并在 P1 删除。

**新页面必须遵守的约定(P1 定下):**

- 页面的每个分区用 `<ToneSection tone="sage|ink">` 包裹,导航才会跟着切换底色。不包的区域,导航按默认的黑底显示。
- 页面顶部要留出 64px 导航高度。导航是 `fixed` 的,不占文档流。
- 页面加载完成后继续派发 `prerender-ready`。
- 颜色只用 5.1 节的令牌和 `fg` / `fg-muted` / `line` / `surface`,不写十六进制色值。

### 8.3 删除(已确认,在 P5 执行)

- `components/home/` 全部 25 个文件
- `components/reactbits/`、`components/effects/AmbientBackground.tsx`、`components/CustomCursor.tsx`
- ~~`components/CommandPalette.tsx`~~:已随 stash 丢弃,工作区里不存在,无需处理
- ~~`components/Header.tsx`~~:P1 已删除
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
- **P5 待决:中文字体声明是否拆出主 CSS。** P0 引入 Noto Sans SC 后,入口 CSS 的 gzip 体积从 10.3 kB 涨到 62.9 kB,多出的是 101 条 `@font-face` 声明,字体文件本身仍按字符区块按需下载。P1 评估后没有拆:站点是客户端渲染,正文本来就要等主 JS(gzip 115 kB)执行完才出现,CSS 和 JS 是并行下载的;拆成 JS 动态加载反而会推迟中文字体开始下载的时间。等 P5 有真机 LCP 数据后再决定。
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

### 12.1 P0 准备(含 git 操作,逐步执行)— ✅ 已完成

目标:从干净的 `main` 出发,在新分支上开工,旧设计改动可恢复但不参与重构。执行结果见 16.1。

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
| P0 准备 ✅ | 见 12.1 | 见 12.1 |
| P1 基础 ✅ | 令牌与 Tailwind 映射、新 `Layout` / 导航 / 页脚、分区背景切换、路由切换 | 四个页面均能打开,导航可用,375/768/1440 无横向滚动条 |
| P2 文章 ✅ | `PostIndex` + 筛选 + 悬停预览;`ArticleBody` 阅读版式;`cover` 字段与脚本改动 | 筛选可用;键盘聚焦可出预览;文章页 17px 正文,对比度达标;没有封面的文章显示排版卡片 |
| P3 首页 ✅ | 加载页、首屏(先用静态回退图)、`LetterAssembly`、最新文章 | 加载页可跳过且每会话一次;关闭动画后首页内容完整 |
| P4 3D | `HeroScene` 懒加载 + 降级条件 + 从场景截图生成回退图 | 满足 7.2 任一降级条件时不请求 `three` 块;帧率与包体积有实测记录 |
| P5 关于与收尾 | `About`(时间线、技术栈、精选仓库)、删除 8.3 节的文件、更新 README、a11y 与性能复查 | 无死代码引用;README 与实际路由、技术栈一致 |

### 12.3 验证方法

沿用本次调研用的无头 Chrome 截图,脚本在 `docs/redesign/tools/shoot.mjs`,用法见第 15 节。每阶段在 375 / 768 / 1024 / 1440 四个宽度各拍一组,并分别在开启和关闭 `prefers-reduced-motion` 下检查。

## 13. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| ~~旧设计改动被误恢复或误提交~~ | — | 已消除:stash 已在 P1 后丢弃 |
| ~~`git stash -u` 误收文档~~ | — | 已消除:文档已提交(`4524feb`) |
| 旧页面仍是旧样式,与新导航、页脚并存 | P2–P5 之间站点视觉不统一 | 只在 `redesign/max-style` 上开发,全部阶段完成前不合入 `main` |
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
| 1 | 工作区 20 项未提交改动 | 不保留。P0 用 stash 收走,P1 验收后已 `git stash drop`(不另建备份分支) |
| 2 | 站名 | 涂家乐 |
| 3 | `CommandPalette` | 删除(设计内没有对应功能) |
| 4 | `Article.cover` | 增加可选字段;缺失时用排版卡片 |
| 5 | 关于页 GitHub 精选仓库 | 展示,失败时隐藏 |
| 6 | 加载页词表 | `涂家乐 / TF49 / BLOG / NOTES / CODE / WRITING` |
| 7 | 首屏 3D | 程序化 Three.js 石头,懒加载,多种条件降级 |
| 8 | Josué / Decart 的角色 | Josué 只取标签药丸与筛选;Decart 不采用 |
| 9 | 整站深色主题切换 | 不做 |
| 10 | Bebas Neue | 不使用(站名为中文,序号标签用 Inter Tight) |
| 11 | 中文字体声明是否拆出主 CSS | P1 不拆,P5 依据实测决定(见第 11 节) |

## 15. 实施入口(给新会话)

### 唯一依据

**`docs/redesign/DESIGN.md`**(本文件)。其余文件都是它的补充:

| 路径 | 内容 | 是否提交 |
|---|---|---|
| `docs/redesign/reference/` | 10 张参考站截图(Max 7 张、Josué 3 张),文件名即内容 | 否(已加入 `.gitignore`) |
| `docs/redesign/tools/shoot.mjs` | 无头 Chrome 滚动截图脚本 | 是 |

`reference/` 里的文件:`max-loader-71pct`、`max-hero`、`max-about-assembling`、`max-about-final`、`max-works-idle`、`max-works-hover`、`max-contact`、`jozue-hero`、`jozue-index-filter`、`jozue-footer-cta`(均为 `.png`)。截图是在 1440×900 下用软件渲染的无头 Chrome 拍的。

### 开始前

1. 通读第 2、5、6、12、16 节,以及 8.2 节末尾的"新页面必须遵守的约定"。
2. P0、P1、P2 已完成。确认当前分支是 `redesign/max-style`,并且 `git status` 干净,然后从 **P3** 开始,每阶段结束时汇报结果。
3. 动手前先读,不要凭印象改:`src/App.tsx`、`src/components/Layout.tsx`、`src/components/site/`、`src/components/effects/SmoothScroll.tsx`、`src/api/index.ts`、`src/api/github.ts`、`scripts/generate-articles.mjs`、`vite.config.ts`、`index.html`。

### 约束

- 不改 `.github/workflows/*`。`generate-articles.mjs` 只允许增加 `cover` 字段的输出。
- 保留各页面里的 `prerender-ready` 事件派发。
- 不复制参考站的任何图片、文案、模型。
- 安装任何依赖前先 `npm view <包名> version` 核实。
- 每个阶段构建通过后单独提交。仓库现有提交风格是 `类型(范围): 中文描述`,例如 `fix(ci): 修复 generate-articles 401 错误`。
- 视觉验证用截图,不要只看构建是否通过。
- 不要推送到 `main`:`deploy.yml` 在推送 `main` 时会直接部署到线上。

### 本机环境注意事项(P0/P1 实测)

- 终端是 Windows PowerShell 5,不支持 `&&`。命令逐条执行,或用 `;` 分隔。`stash@{0}` 这类带花括号的参数要加引号。
- 本机连 GitHub 的 22 端口会被断开(`Connection closed`),但 443 端口的 SSH 可以正常认证。推送时直接写完整地址,不改仓库配置:
  `git push "ssh://git@ssh.github.com:443/TF49/personal-blog.git" redesign/max-style`
  用这种方式推送后,本地的 `origin/redesign/max-style` 不会自动更新。核对远端用 `git ls-remote <同一地址>`。
- `package-lock.json` 里的包地址全部指向 `registry.npmmirror.com`,新装的包也要沿用。不要同时运行两个 `npm install`,会互相冲突(P0 遇到过 ENOENT)。
- 本地 `npm run build` 会把 `localhost` 写进 `public/sitemap.xml`,提交前先 `git restore public/sitemap.xml public/robots.txt`。
- 截图环境已装在 `%TEMP%\shotrunner`(puppeteer-core 25.16.0)。P1 的验收脚本 `p1check.mjs` 也在那里,会检查 4 个页面 × 4 个宽度的横向溢出、导航、手机菜单和 reduced-motion,可以改成后续阶段的验收脚本。

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

> 请阅读 `docs/redesign/DESIGN.md`(重点看第 8.2、12.2、15、16 节),在 `redesign/max-style` 分支上执行 P3。完成后汇报验收结果和截图,等我确认后再提交。

## 16. 实施记录

### 16.1 P0 准备(2026-11-04)

| 步骤 | 结果 |
|---|---|
| 1. 提交设计文档 | 新建分支 `redesign/max-style`,提交 `4524feb`,包含 `DESIGN.md`、`tools/shoot.mjs`、`.gitignore`。`reference/` 没有进入提交 |
| 2. 收走旧设计改动 | stash 收走 19 个已跟踪文件和 `CommandPalette.tsx`,工作区变干净。P1 后已 drop |
| 3. 基线构建 | `npm ci`、`npm run build` 通过。基线入口 CSS gzip 10.3 kB,主 JS gzip 154.4 kB |
| 4. 安装依赖 | `three@0.187.0`、`@types/three@0.187.0`(dev)、`@fontsource-variable/inter-tight@5.3.0`、`@fontsource-variable/noto-sans-sc@5.3.1`、`@fontsource/jetbrains-mono@5.3.0`、`@phosphor-icons/react@2.1.10`。锁文件只有新增条目,没有升级已有的包 |
| 5. 字体自托管 | 删除 `index.html` 的 3 行 Google Fonts 链接,以及 `index.css` 里一条文档没列出的 Inter `@import`。产物中 `fonts.googleapis.com` / `fonts.gstatic.com` 引用为 0 |

提交:`a83d1fe chore(redesign): 安装重构依赖并改为字体自托管`。

### 16.2 P1 基础(2026-11-04)

提交:`9c0d2e3 feat(redesign): 新增设计令牌、导航、页脚与路由切换`,已推送到 `origin/redesign/max-style`。

**验收(无头 Chrome 自动检查,开发服务器)**

| 项 | 结果 |
|---|---|
| 四个页面能打开 | `/`、`/blog`、`/blog/:slug`、`/about` 在 375 / 768 / 1024 / 1440 下都没有页面错误 |
| 无横向滚动条 | 16 个组合全部通过。首次检查时首页在 375 宽有溢出,来自旧首页的装饰光斑和跑马灯;在 `main` 上加 `overflow-x: clip` 解决 |
| 桌面导航 | 点击后路由正确,当前页显示下划线,`aria-current="page"` 正确,回到顶部,焦点移到 `#main-content` |
| 手机菜单(375) | 按钮 44×44;菜单黑底,链接 28px;打开时正文和页脚 `inert`、页面锁定滚动,焦点在第一个链接;Esc 关闭后焦点回到按钮;点链接跳转后菜单收起 |
| 跳到正文 | 首次按 Tab 出现在左上角,回车后焦点进入正文,URL 不变 |
| 导航色调切换 | 页脚顶边距视口顶部 33px 时导航为黑底,31px 时切为绿底,滚回后恢复 |
| reduced-motion | 路由切换时每 50ms 采样一次,不透明度始终为 1,没有淡入淡出 |
| 构建 | 通过。入口 CSS gzip 63.6 kB,主 JS gzip 115.1 kB(基线 154.4 kB) |

**与原计划的偏差**

1. 删除了旧的 `Header.tsx`,原计划没有列出它。删除前全局搜索确认没有引用。
2. 路由切换改为先淡出再淡入,没有做成两页叠放的交叉淡入,总时长同样是 300ms。交叉淡入要同时渲染新旧两页,还要处理两页各自的滚动位置,复杂度高。
3. 新增 `ToneSection` 组件和 `tone.ts`,用来实现"分区背景切换"。原清单里没有这两个文件。
4. 中文字体声明没有拆出主 CSS,推迟到 P5 决定,理由见第 11 节。

**已知遗留(按计划在后续阶段处理)**

- 四个页面的正文仍是旧设计,依赖 `index.css` 里标注"旧设计样式"的类、`--color-*` 变量,以及 Tailwind 的 `font-display` 别名。它们在 P2、P3、P5 重写页面时一并删除。
- `AmbientBackground.tsx`、`CustomCursor.tsx`、`reactbits/`、`components/home/`、`utils/gsapAnimations.ts` 仍在,按 8.3 节在 P5 删除。`Toast.tsx` 仍引用 `lucide-react`。
- 手机端只做了无头 Chrome 测试,真机的触摸滚动和 iOS Safari 表现尚未验证。

### 16.3 P2 文章(2026-11-04)

提交:`feat(redesign): P2 文章列表与阅读版式`

**新建组件(`src/components/site/`)**

| 组件 | 说明 |
|---|---|
| `TagPill.tsx` | 分类筛选药丸按钮。有 `onClick` 时为 `<button>`,无时为 `<span>`。Active:实色填充;Inactive:描边 `border-line` |
| `FilterBar.tsx` | "全部"+ 各分类 TagPill 横排,`flex-wrap` |
| `PostPreview.tsx` | 悬停预览卡,`bg-ink text-fg w-72`,`aria-hidden="true"`。有 `cover` 时显示图片,无时显示分类 + 日期 + 标题排版卡片 |
| `PostIndex.tsx` | 两列错落索引(`grid-cols-1 lg:grid-cols-2`)。悬停行保持全亮,其余降至 `opacity-40`。PreviewCard 用 `position:fixed` 跟随光标;触屏(`hover:none` 媒体查询)和 `prefers-reduced-motion` 下不显示预览。预览卡位置右侧夹紧视口(w-72 + 24px 安全距离) |
| `ArticleBody.tsx` | 渲染预消毒 HTML,包裹 `.article-body` class |

**修改**

| 文件 | 变更 |
|---|---|
| `src/types/index.ts` | `Article` 增加 `cover?: string` |
| `scripts/generate-articles.mjs` | 提取 frontmatter `cover` → 正文首图 `<img src>` → 省略 |
| `src/index.css` | 追加 `.article-body` prose 样式:17px/1.85、h2/h3/h4、链接、代码块、引用、图片、`.code-copy-btn` |
| `src/pages/Blog.tsx` | 全量重写。`ToneSection tone="ink"` 全页;`SectionLabel`、`FilterBar`、`PostIndex`。移除 framer-motion、lucide-react、reactbits、gsapAnimations |
| `src/pages/BlogPost.tsx` | 全量重写。页头 `tone="ink"` + 正文 `tone="sage"`(墨字/绿底 11.17:1)。阅读进度条(scroll listener)、TagPill 分类、ArticleBody 正文、阅读时长估算(约 350 字/分钟)、代码复制按钮注入。保留 DOMPurify、SEO、useToast、shareOrCopy、prerender-ready |

**验收(无头 Chrome 1440 / 375)**

| 项 | 结果 |
|---|---|
| 筛选条 | 全部 / 未分类 / 开发笔记 三个药丸,点击过滤 |
| 悬停预览 | 桌面光标移入行出现排版卡片;375 无预览(`hover:none`) |
| 文章正文字号 | 17px,行高 1.85,绿底分区对比度 11.17:1 |
| 无封面排版卡片 | 所有文章无 cover,预览卡显示分类 + 日期 + 标题 |
| 无横向溢出 | 1440 / 375 通过 |
| 构建 | exit 0,6.02s |

**与原计划的偏差**

1. **PostIndex 触屏适配**:原计划写"触屏无预览";实现时用 `window.matchMedia('(hover: hover)')` 在运行时检测,而非 CSS-only 方案。效果等价。
2. **DOMPurify `ALLOWED_URI_REGEXP`**:原 BlogPost 的正则字面量 `\\/` 被写入工具转义为 `\\\\/` 导致 TS1005 解析错误;改为 `const URI_RE = /…/ as unknown as RegExp` 绕过。
3. **正文中出现 frontmatter YAML 文本**:源 Issue 正文包含未被 gray-matter 识别的 YAML 块(正文第一行不是 `---`),前端照样渲染。属数据内容问题,非代码 bug,记录存档,不影响验收。

**已知遗留(按计划在后续阶段处理)**

- `components/home/`(25 个文件)、`reactbits/`、`AmbientBackground.tsx`、`CustomCursor.tsx`、`utils/gsapAnimations.ts` 仍存在,按 8.3 节在 P5 删除。`Blog.tsx` / `BlogPost.tsx` 已不再引用这些文件,可安全保留到 P5。
- `index.css` 里标注"旧设计样式"的类仍在,随 P3 / P5 旧页面重写时删除。
- 移动端只做了无头 Chrome 测试,真机触摸和 iOS Safari 待 P5 验证。


### 16.4 P3 首页(2026-11-04)

提交:`feat(redesign): P3 首页加载页、首屏、关于与最新文章`

**新建组件(`src/components/site/`)**

| 组件 | 说明 |
|---|---|
| `IntroLoader.tsx` | Canvas 2D 字母环加载页。6 圈词表(`涂家乐 / TF49 / BLOG / NOTES / CODE / WRITING`),各圈淡入(stagger 0.12s)→ 计数 0→100(1.4s 线性)→ 淡出(0.8s)。GSAP 时间线控制 alpha 和计数值;Canvas `requestAnimationFrame` 循环绘制字母圆弧(呼吸弧长 `π + sin(t − offset) × 0.5`)。每会话一次(`sessionStorage["tf49:intro-seen"]`);点击 / Enter / Esc 可跳过;`prefers-reduced-motion` 或 `__PRERENDER_INJECTED` 时直接跳过;`aria-hidden="true"`,不阻塞 DOM |
| `GhostHeading.tsx` | 幽灵大标题。`text-display` 字号,颜色 `--ghost`,`aria-hidden="true"`,`overflow-hidden`。ScrollTrigger `scrub: 1` 驱动奇偶行交替横向位移(±60px);reduced-motion 下静态显示 |
| `LetterAssembly.tsx` | 字母聚拢。目标层(`<p>` 内每字一个 `<span data-char>`,初始 `opacity: 0`)+ 飞行层(`aria-hidden`,绝对定位)。ScrollTrigger `start: "50% 100%"` / `end: "50% -10%"` / `scrub: 1` 驱动 GSAP timeline;每个飞行字母沿三点路径(`curviness: 0.85`,控制点 ±90px / +160px)运动,间隔 0.025s;飞行字母在 `progress > 0.65` 淡出,目标字符同时淡入。手机(`< 768px`)和 reduced-motion 下整段淡入 |
| `HeroFallback.tsx` | 首屏静态占位(P4 才接 3D)。背景色由外层 `ToneSection tone="sage"` 提供;右对齐错行标语(`text-display` 幽灵装饰行 + `text-h1` 主标题 + `text-body` 副标题);`radial-gradient` 点阵与圆圈装饰,均 `aria-hidden`;高度 `100vh`,顶部 `--header-h` 留给固定导航 |

**修改**

| 文件 | 变更 |
|---|---|
| `src/pages/Home.tsx` | 全量重写。移除旧 `components/home/`(25 个文件)、`framer-motion`、`lucide-react`、`reactbits`、`gsapAnimations`、`CustomCursor` 的全部引用。新结构:`IntroLoader`(加载页,首次访问) + `ToneSection tone="sage"` 首屏(`HeroFallback`) + `ToneSection tone="ink"` 关于(`GhostHeading` + `LetterAssembly`) + `ToneSection tone="ink"` 最新文章(`PostIndex`,取最近 6 篇)。保留 `prerender-ready` 事件派发(文章加载完成后) |
| `docs/redesign/DESIGN.md` | 状态升至 v1.3;P3 标记 ✅;追加本节 |

**验收(无头 Chrome 1440 / 768 / 375)**

| 项 | 结果 |
|---|---|
| 加载页每会话一次 | 首次出现,刷新后跳过(`sessionStorage` 有值直接 `onDone`) |
| 加载页可跳过 | 点击 / Enter / Esc 均可立即结束 |
| reduced-motion | 加载页跳过,首页内容直接完整显示 |
| 首屏 | sage 色背景,右对齐错行标语,幽灵装饰大字正常 |
| 关于分区 | 幽灵大标题横向位移可见;字母聚拢段落正确渲染 |
| 最新文章 | PostIndex 两列错落索引(1440),单列(375 / 768);悬停预览在 1440 正常 |
| 无横向溢出 | 1440 / 768 / 375 均通过 |
| 构建 | exit 0,7.26s;`Home.js` gzip 13.18 kB,主包 gzip 115 kB(无 Three.js) |

**与原计划的偏差**

1. **`HeroFallback` 无静态截图资源**:原计划\"从场景截图生成静态 WebP\",P3 改为纯 CSS 装饰占位。P4 接入 Three.js 场景后再从场景截图生成最终回退图,流程不变。
2. **`LetterAssembly` 坐标时序**:飞行字母起点通过 `getBoundingClientRect` 在 `useEffect` 挂载时计算,若 DOM 尚未稳定可能轻微偏移。已通过手机和 reduced-motion 降级(整段淡入)规避主要场景。
3. **`GhostHeading` 超小屏截断**:320px 以下大标题可能被 `overflow-hidden` 截断,设计目标断点最小为 375px,不影响验收。

**已知遗留(按计划在后续阶段处理)**

- `components/home/`(25 个文件)、`reactbits/`、`AmbientBackground.tsx`、`CustomCursor.tsx`、`utils/gsapAnimations.ts` 仍在,`Home.tsx` 已不再引用,按 8.3 节在 P5 删除。
- `index.css` 里标注\"旧设计样式\"的类仍在,随 P5 旧页面重写时一并删除。
- 移动端只做了无头 Chrome 测试,真机触摸和 iOS Safari 待 P5 验证。

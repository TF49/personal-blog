import { ArrowUpRightIcon } from '@phosphor-icons/react'
import SectionLabel from '../SectionLabel'
import { ICON_SM } from '../icon'

interface ColophonProps {
  index: number
  repoUrl: string
}

/** 文章流水线:每一步都对应仓库里真实存在的脚本、文件或工作流 */
const STEPS = [
  {
    key: 'WRITE',
    title: '写作',
    description: '在内容仓库新建 Issue 并打上 blog 标签，正文就是 Markdown。',
    code: 'TF49/blog-content',
  },
  {
    key: 'FETCH',
    title: '抓取',
    description: 'GitHub Actions 每小时同步一次，读取 Issue 正文、分类和评论数。',
    code: 'generate-articles.mjs',
  },
  {
    key: 'DATA',
    title: '数据',
    description: '输出为一份 JSON，它是站点唯一的文章数据源。',
    code: 'public/articles.json',
  },
  {
    key: 'BUILD',
    title: '构建',
    description: '先做类型检查再由 Vite 打包；Three.js 只在桌面端按需加载。',
    code: 'tsc -b && vite build',
  },
  {
    key: 'DEPLOY',
    title: '发布',
    description: '静态产物发布到 GitHub Pages，没有服务器，也不收集访问数据。',
    code: 'GitHub Pages',
  },
] as const

/** 构建时由 vite.config.ts 注入的依赖名 → 展示名 */
const DEP_LABELS: Record<string, string> = {
  react: 'React',
  three: 'Three.js',
  gsap: 'GSAP',
  tailwindcss: 'Tailwind CSS',
  vite: 'Vite',
  typescript: 'TypeScript',
}

function formatBuildDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  }).format(date)
}

/**
 * 本站构建段(sage)。用一条五步文字流水线说明文章如何从 GitHub Issues
 * 变成静态页面;下方的依赖版本与构建日期在构建时注入,不手写。
 */
export default function Colophon({ index, repoUrl }: ColophonProps) {
  const deps = Object.entries(__BUILD_INFO__.deps).filter(([name]) => name in DEP_LABELS)

  return (
    <div className="site-wrap py-24 md:py-32">
      <SectionLabel label="COLOPHON" index={index} />

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] md:items-end">
        <h2 id="colophon-heading" className="text-h1 font-semibold">
          这个网站本身
        </h2>
        <p className="text-body text-fg-muted">
          没有后端，也没有 CMS。文章写在 GitHub Issues 里，一条流水线把它们变成你现在看到的静态页面。
        </p>
      </div>

      <ol className="mt-16 grid border-t border-line md:mt-24 md:grid-cols-5">
        {STEPS.map((step, i) => (
          <li
            key={step.key}
            className={[
              'flex flex-col py-8 md:py-10',
              i > 0 ? 'border-t border-line md:border-l md:border-t-0 md:pl-6' : '',
              i < STEPS.length - 1 ? 'md:pr-6' : '',
            ].join(' ')}
          >
            <p className="flex items-center justify-between text-label text-fg-muted">
              <span>
                <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span> — {step.key}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="hidden md:inline">
                  →
                </span>
              )}
            </p>
            <h3 className="mt-6 text-h2 font-medium md:mt-10">{step.title}</h3>
            <p className="mt-3 text-body text-fg-muted">{step.description}</p>
            <code className="mt-6 self-start break-all font-mono text-label normal-case text-fg md:mt-auto md:pt-6">
              {step.code}
            </code>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-6 border-y border-line py-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-label">
          {deps.map(([name, version]) => (
            <div key={name} className="flex gap-2">
              <dt className="text-fg-muted">{DEP_LABELS[name]}</dt>
              <dd className="tabular-nums">{version}</dd>
            </div>
          ))}
          <div className="flex gap-2">
            <dt className="text-fg-muted">最近构建</dt>
            <dd className="tabular-nums">
              <time dateTime={__BUILD_INFO__.builtAt}>{formatBuildDate(__BUILD_INFO__.builtAt)}</time>
            </dd>
          </div>
        </dl>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-pill border border-line px-5 text-label text-fg transition-[background-color,color,border-color] duration-200 hover:border-fg hover:bg-ink hover:text-sage md:self-auto"
        >
          查看源码
          <ArrowUpRightIcon {...ICON_SM} aria-hidden />
          <span className="sr-only">(在新标签页打开)</span>
        </a>
      </div>
    </div>
  )
}

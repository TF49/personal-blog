/**
 * HeroFallback — 首屏静态占位（P3）
 * - P4 才接 Three.js 3D，当前为静态 sage 色背景 + 装饰元素
 * - 背景色由外层 ToneSection tone="sage" 提供
 * - 高度 100vh，顶部 64px 留给固定导航
 * - 右对齐、错行标语
 */
interface HeroFallbackProps {
  title?: string
  subtitle?: string
}

export default function HeroFallback({
  title = '全栈工程师',
  subtitle = 'AI 工具链 · 独立开发者',
}: HeroFallbackProps) {
  return (
    <div
      className="relative flex flex-col justify-end"
      style={{ height: '100vh', paddingTop: 'var(--header-h)' }}
    >
      {/* 装饰：右上角网格点阵 */}
      <div
        aria-hidden="true"
        className="absolute top-24 right-0 w-64 h-64 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--ink) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* 装饰：左下角大圆圈 */}
      <div
        aria-hidden="true"
        className="absolute bottom-16 left-[-80px] w-64 h-64 rounded-full border border-line opacity-30 pointer-events-none"
      />

      {/* 标语区：右对齐，错行 */}
      <div className="site-wrap pb-20">
        <div className="flex flex-col items-end text-right">
          {/* 大装饰行 */}
          <span
            aria-hidden="true"
            className="text-display font-semibold leading-none select-none"
            style={{ color: 'var(--ghost)' }}
          >
            TF49
          </span>

          {/* 主标题（错位：比大装饰行缩进） */}
          <h1 className="text-h1 font-semibold text-fg leading-tight mt-2 max-w-xs md:max-w-md">
            {title}
          </h1>

          {/* 副标题 */}
          <p className="text-body text-fg-muted mt-3">{subtitle}</p>

          {/* 分隔线装饰 */}
          <div className="mt-8 h-px w-24 bg-line" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

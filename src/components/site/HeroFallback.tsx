/**
 * HeroFallback — 首屏静态占位
 * - 满足降级条件时（移动端、reduced-motion、无 WebGL2、saveData、prerender）由 HeroScene 渲染此组件
 * - 也作为 Suspense fallback 在 HeroScene 加载期间显示
 * - 背景：有 hero-fallback.png 时使用 CSS background-image（3D 场景截图），
 *         否则退回到 ToneSection 提供的 sage 底色
 * - 高度 100vh，顶部留给固定导航
 * - 右对齐、错行标语，墨色文字（contrast 11.17:1 on sage 背景）
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
      style={{
        height: '100vh',
        paddingTop: 'var(--header-h)',
        backgroundImage: 'url(/hero-fallback.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 轻微暗色遮罩，确保文字对比度 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(194,202,187,0.15)' }}
      />

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
      <div className="relative site-wrap pb-20">
        <div className="flex flex-col items-end text-right">
          {/* 大装饰行 */}
          <span
            aria-hidden="true"
            className="text-display font-semibold leading-none select-none"
            style={{ color: 'var(--ghost)' }}
          >
            TF49
          </span>

          {/* 主标题 */}
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

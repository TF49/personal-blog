/** @type {import('tailwindcss').Config} */

// 线性流体字号:手机 375px 取 min,桌面 1440px 取 max(DESIGN.md 5.2)
const fluid = (min, max) => {
  const slope = (max - min) / (1440 - 375)
  const intercept = min - slope * 375
  return `clamp(${min}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(3)}vw, ${max}px)`
}

const sansStack = ['"Inter Tight Variable"', '"Noto Sans SC Variable"', 'system-ui', '-apple-system', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif']

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: sansStack,
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        display: [fluid(72, 160), { lineHeight: '0.95' }],
        h1: [fluid(36, 56), { lineHeight: '1.1' }],
        h2: [fluid(24, 32), { lineHeight: '1.2' }],
        'body-lg': ['17px', { lineHeight: '1.85' }],
        body: ['15px', { lineHeight: '1.7' }],
        label: ['13px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      colors: {
        // 两种基础色,支持透明度修饰(如 bg-ink/40)
        sage: 'rgb(var(--sage-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        // 与 :root 令牌同名的语义色
        'on-sage': 'var(--on-sage)',
        'on-ink': 'var(--on-ink)',
        'on-sage-muted': 'var(--on-sage-muted)',
        'on-ink-muted': 'var(--on-ink-muted)',
        'line-sage': 'var(--line-sage)',
        'line-ink': 'var(--line-ink)',
        ghost: 'var(--ghost)',
        // 随所在分区(.tone-sage / .tone-ink)自动切换的语义色
        surface: 'var(--surface)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        line: 'var(--line)',
      },
      maxWidth: {
        content: '1230px',
        article: '720px',
        timeline: '670px',
      },
      borderRadius: {
        pill: '999px',
        img: '4px',
      },
    },
  },
  plugins: [],
}

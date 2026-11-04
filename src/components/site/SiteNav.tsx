import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'

export const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/blog', label: '文章', end: false },
  { to: '/about', label: '关于', end: false },
] as const

interface SiteNavProps {
  variant: 'bar' | 'menu'
  onNavigate?: () => void
  id?: string
}

const linkBase =
  'inline-flex min-h-[44px] items-center underline decoration-1 decoration-transparent transition-[text-decoration-color,opacity] duration-200 hover:decoration-current [&.active]:decoration-current'

const variantClass = {
  // 桌面导航:13px;左右内边距撑出 44px 触控宽度
  bar: `${linkBase} min-w-[44px] justify-center px-3 text-label underline-offset-[6px]`,
  // 手机全屏菜单:28px
  menu: `${linkBase} text-[28px] leading-[1.2] font-medium underline-offset-[8px]`,
}

/** 站点主导航;当前页由 NavLink 自动加 aria-current="page" 与 .active */
const SiteNav = forwardRef<HTMLAnchorElement, SiteNavProps>(function SiteNav({ variant, onNavigate, id }, firstLinkRef) {
  return (
    <nav aria-label="主导航" id={id}>
      <ul className={variant === 'bar' ? 'flex items-center gap-2' : 'flex flex-col gap-4'}>
        {navItems.map(({ to, label, end }, i) => (
          <li key={to}>
            <NavLink
              ref={i === 0 ? firstLinkRef : undefined}
              to={to}
              end={end}
              onClick={onNavigate}
              className={variantClass[variant]}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
})

export default SiteNav

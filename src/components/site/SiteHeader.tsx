import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { profile } from '@/data/profile'
import { useLenis } from '@/components/effects/SmoothScroll'
import SiteNav from './SiteNav'
import { ICON_MD } from './icon'
import { toneClass, useHeaderTone } from './tone'

const MENU_ID = 'mobile-menu'
// 菜单打开时让页面其余部分不可聚焦、不被读屏读到
const INERT_TARGETS = ['#skip-link', '#main-content', '#site-footer']
const DESKTOP_QUERY = '(min-width: 768px)'

function setPageInert(inert: boolean) {
  INERT_TARGETS.forEach((selector) => {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) return
    if (inert) el.setAttribute('inert', '')
    else el.removeAttribute('inert')
  })
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionTone = useHeaderTone()
  const tone = menuOpen ? 'ink' : sectionTone
  const lenis = useLenis()
  const { pathname } = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  // 路由变化时收起菜单(焦点交给 PageTransition 移到正文)
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // 窗口放大到桌面宽度时收起菜单
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // 打开:锁定滚动、页面其余部分 inert、焦点进入菜单;Esc 关闭
  useEffect(() => {
    if (!menuOpen) return
    lenis?.stop()
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    setPageInert(true)
    firstLinkRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu(true)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      setPageInert(false)
      root.style.overflow = prevOverflow
      lenis?.start()
    }
  }, [menuOpen, lenis, closeMenu])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${toneClass[tone]}`}>
      <div className="site-wrap flex h-16 items-center justify-between">
        <Link
          id="site-home-link"
          to="/"
          className="-mx-2 inline-flex min-h-[44px] items-center px-2 text-[17px] font-bold tracking-[0.04em]"
        >
          {profile.name}
        </Link>

        <div className="hidden md:block">
          <SiteNav variant="bar" />
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2.5 inline-flex h-11 w-11 items-center justify-center transition-opacity duration-150 active:opacity-60 md:hidden"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <XIcon {...ICON_MD} aria-hidden /> : <ListIcon {...ICON_MD} aria-hidden />}
        </button>
      </div>

      {menuOpen && (
        <div
          id={MENU_ID}
          className="menu-enter fixed inset-x-0 bottom-0 top-16 overflow-y-auto tone-ink md:hidden"
          data-lenis-prevent
        >
          <div className="site-wrap pb-12 pt-8">
            <SiteNav variant="menu" ref={firstLinkRef} onNavigate={() => closeMenu(false)} />
          </div>
        </div>
      )}
    </header>
  )
}

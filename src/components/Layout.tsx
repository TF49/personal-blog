import type { MouseEvent, ReactNode } from 'react'
import Footer from './Footer'
import { ToastProvider } from './toast/ToastProvider'
import SmoothScroll, { useLenis } from './effects/SmoothScroll'
import SiteHeader from './site/SiteHeader'

interface LayoutProps {
  children?: ReactNode
}

function SkipLink() {
  const lenis = useLenis()
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main-content')
    if (!main) return
    // 不改 URL hash,避免触发路由更新
    e.preventDefault()
    if (lenis) lenis.scrollTo(main, { immediate: true, force: true })
    else main.scrollIntoView()
    main.focus({ preventScroll: true })
  }
  return (
    <a id="skip-link" href="#main-content" onClick={onClick} className="skip-link">
      跳到正文
    </a>
  )
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ToastProvider>
      <SmoothScroll>
        <SkipLink />
        <SiteHeader />
        {/* overflow-x: clip 兜住装饰元素的横向溢出;用 clip 而非 hidden,不破坏内部 sticky 定位 */}
        <main id="main-content" tabIndex={-1} className="relative min-h-screen overflow-x-clip outline-none">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </ToastProvider>
  )
}

import { Link } from 'react-router-dom'
import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { profile } from '@/data/profile'
import { useLenis } from '@/components/effects/SmoothScroll'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import ToneSection from '@/components/site/ToneSection'
import { navItems } from '@/components/site/SiteNav'
import RollText from '@/components/site/RollText'
import { ICON_SM } from '@/components/site/icon'

// 只展示已配置真实地址的社交链接
const socialLinks = profile.social.filter((s) => s.url && s.url !== '#')

/**
 * 页脚(sage):导航 → 超大姓名 → 社交链接 → 邮箱 → 版权与返回顶部。
 * 版式参照 Max 的页脚节奏,姓名和链接均为本站真实信息。
 */
export default function Footer() {
  const lenis = useLenis()

  const backToTop = () => {
    const reduced = prefersReducedMotion()
    if (lenis) lenis.scrollTo(0, { immediate: reduced })
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    // 焦点回到页首,避免键盘用户停留在页脚
    document.getElementById('site-home-link')?.focus({ preventScroll: true })
  }

  return (
    <ToneSection as="footer" tone="sage" id="site-footer" aria-labelledby="footer-heading">
      <div className="site-wrap flex min-h-[70svh] flex-col pb-8 pt-24 md:pt-32">
        <h2 id="footer-heading" className="sr-only">
          页脚
        </h2>

        <nav aria-label="页脚导航">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-label uppercase">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="group inline-flex min-h-11 items-center px-1">
                  <RollText text={label} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p
            aria-hidden="true"
            className="select-none text-[clamp(72px,11vw,160px)] font-black leading-[0.9] tracking-[-0.02em]"
          >
            {profile.name}
          </p>
          <p className="mt-5 text-label uppercase tracking-[0.2em] text-fg-muted">TF49 · {profile.location}</p>

          {socialLinks.length > 0 && (
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-6 text-label">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-1.5 px-1"
                  >
                    <RollText text={s.name} />
                    <ArrowUpRightIcon {...ICON_SM} aria-hidden />
                    <span className="sr-only">(在新标签页打开)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <a
            href={`mailto:${profile.email}`}
            className="mt-4 inline-flex min-h-11 max-w-full items-center gap-3 break-all text-[clamp(18px,1.8vw,24px)] font-semibold underline decoration-1 decoration-transparent underline-offset-[8px] transition-[text-decoration-color] duration-200 hover:decoration-current"
          >
            <span className="uppercase text-fg-muted">Email :</span>
            {profile.email}
          </a>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-6 text-label md:flex-row">
          <p className="text-fg-muted">© {new Date().getFullYear()} {profile.name} · 由 GitHub Issues 驱动</p>
          <button
            type="button"
            onClick={backToTop}
            className="inline-flex min-h-[44px] items-center gap-2 px-2 underline decoration-1 decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-200 hover:decoration-current"
          >
            返回顶部
            <ArrowRightIcon {...ICON_SM} aria-hidden className="-rotate-90" />
          </button>
        </div>
      </div>
    </ToneSection>
  )
}

import { ArrowRightIcon, ArrowUpRightIcon, EnvelopeSimpleIcon, GithubLogoIcon } from '@phosphor-icons/react'
import { profile } from '@/data/profile'
import { useLenis } from '@/components/effects/SmoothScroll'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import ToneSection from '@/components/site/ToneSection'
import SectionLabel from '@/components/site/SectionLabel'
import { ICON_MD, ICON_SM } from '@/components/site/icon'

// 只展示已配置真实地址的社交链接
const socialLinks = profile.social.filter((s) => s.url && s.url !== '#')

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
      <div className="site-wrap pb-12 pt-24 md:pt-32">
        <SectionLabel label="CONTACT" align="center" />
        <h2 id="footer-heading" className="sr-only">
          联系方式
        </h2>

        <div className="mt-12 flex flex-col items-center gap-8 text-center md:mt-16">
          <p className="text-body text-fg-muted">有想法、合作或问题,欢迎来信。</p>
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex min-h-[44px] max-w-full items-center gap-3 break-all text-h2 font-medium underline decoration-1 decoration-transparent underline-offset-[10px] transition-[text-decoration-color] duration-200 hover:decoration-current"
          >
            <EnvelopeSimpleIcon {...ICON_MD} aria-hidden className="shrink-0" />
            {profile.email}
          </a>

          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-current px-5 text-label transition-colors duration-200 hover:bg-ink hover:text-sage"
                  >
                    {s.name === 'GitHub' && <GithubLogoIcon {...ICON_SM} aria-hidden />}
                    {s.name}
                    <ArrowUpRightIcon {...ICON_SM} aria-hidden />
                    <span className="sr-only">(在新标签页打开)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-24 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-6 text-label md:mt-32 md:flex-row">
          <p className="text-fg-muted">© {new Date().getFullYear()} {profile.name}</p>
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

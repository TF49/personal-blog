import { forwardRef, type ReactNode } from 'react'
import HeroCopy from './HeroCopy'
// 回退图由 docs/redesign/tools/capture-hero.mjs 从 3D 场景截取,不含文字。
// 用 import 引入,Vite 会加上部署子路径(/personal-blog/)和内容哈希
import heroLandscape from '@/assets/hero/hero-landscape.webp'
import heroPortrait from '@/assets/hero/hero-portrait.webp'

interface HeroFrameProps {
  title: string
  subtitle: string
  /** 叠在回退图与文字之间的层,HeroScene 用它放 3D 画布 */
  children?: ReactNode
}

/**
 * 首屏外框:回退图(最底层)→ children(3D 画布)→ 文字层。
 * 横屏用横向构图,竖屏用竖向构图,与 3D 场景的取景规则一致(hero/rockScene.ts)。
 */
export const HeroFrame = forwardRef<HTMLDivElement, HeroFrameProps>(function HeroFrame(
  { title, subtitle, children },
  ref,
) {
  return (
    <div ref={ref} className="hero-h relative overflow-hidden">
      <picture>
        <source media="(orientation: landscape)" srcSet={heroLandscape} />
        <img
          src={heroPortrait}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
      </picture>
      {children}
      <HeroCopy title={title} subtitle={subtitle} />
    </div>
  )
})

interface HeroFallbackProps {
  title: string
  subtitle: string
}

/**
 * 首屏静态版本。满足降级条件(手机、减少动态效果、无 WebGL2、省流量、预渲染)时使用,
 * 也是 HeroScene 懒加载期间的 Suspense 占位。
 */
export default function HeroFallback({ title, subtitle }: HeroFallbackProps) {
  return <HeroFrame title={title} subtitle={subtitle} />
}

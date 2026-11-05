import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecentArticles } from '@/api'
import type { Article } from '@/types'
import SEO from '@/components/SEO'
import ToneSection from '@/components/site/ToneSection'
import SectionLabel from '@/components/site/SectionLabel'
import PostIndex from '@/components/site/PostIndex'
import IntroLoader from '@/components/site/IntroLoader'
import GhostHeading from '@/components/site/GhostHeading'
import LetterAssembly from '@/components/site/LetterAssembly'
import HeroFallback from '@/components/site/HeroFallback'
import { profile } from '@/data/profile'

// HeroScene 懒加载：Three.js 不进入主包
const HeroScene = lazy(() => import('@/components/site/HeroScene'))

export default function Home() {
  const [introDone, setIntroDone] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    getRecentArticles(6)
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => {
        document.dispatchEvent(new Event('prerender-ready'))
      })
  }, [])

  return (
    <>
      <SEO
        title="首页"
        description={`${profile.name}的个人博客，聚焦全栈开发、AI 工具链、Linux 运维实践与技术文章。`}
      />

      {/* 加载页（每会话一次，自动跳过 reduced-motion / prerender） */}
      {!introDone && <IntroLoader onDone={() => setIntroDone(true)} />}

      {/* ========== 首屏 ========== */}
      <ToneSection tone="sage" as="section" aria-label="首屏">
        {/* HeroScene 懒加载;降级逻辑在 HeroScene 内部完成 */}
        <Suspense fallback={<HeroFallback title={profile.title} subtitle={profile.name} />}>
          <HeroScene title={profile.title} subtitle={profile.name} />
        </Suspense>
      </ToneSection>

      {/* ========== 关于 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="about-heading">
        <div className="site-wrap py-24 md:py-36">
          <SectionLabel label="ABOUT" index={2} className="mb-12" />

          {/* 幽灵大标题（装饰性） */}
          <GhostHeading
            lines={['ABOUT', 'ME']}
            className="mb-8 -mx-4 md:-mx-8"
          />

          {/* 真实标题（无障碍） */}
          <h2
            id="about-heading"
            className="text-h1 font-semibold text-fg mb-8 max-w-lg"
          >
            {profile.name}
          </h2>

          {/* 字母聚拢段落 */}
          <div className="max-w-2xl">
            <LetterAssembly text={profile.bio} />
          </div>
        </div>
      </ToneSection>

      {/* ========== 最新文章 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="posts-heading">
        <div className="site-wrap py-24 md:py-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <SectionLabel label="WRITING" index={3} className="mb-4" />
              <h2
                id="posts-heading"
                className="text-h1 font-semibold text-fg"
              >
                最新文章
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-label text-fg-muted hover:text-fg transition-colors border-b border-line pb-0.5"
            >
              全部文章 →
            </Link>
          </div>

          <PostIndex articles={articles} />

          {/* 手机端查看全部链接 */}
          <div className="mt-10 sm:hidden">
            <Link
              to="/blog"
              className="text-label text-fg-muted hover:text-fg transition-colors border-b border-line pb-0.5"
            >
              全部文章 →
            </Link>
          </div>
        </div>
      </ToneSection>
    </>
  )
}

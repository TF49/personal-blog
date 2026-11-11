import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { getArticles, getPinnedRepos } from '@/api'
import type { Article, GitHubRepo } from '@/types'
import SEO from '@/components/SEO'
import ToneSection from '@/components/site/ToneSection'
import SectionLabel from '@/components/site/SectionLabel'
import PostIndex from '@/components/site/PostIndex'
import IntroLoader from '@/components/site/IntroLoader'
import GhostHeading from '@/components/site/GhostHeading'
import LetterAssembly from '@/components/site/LetterAssembly'
import HeroFallback from '@/components/site/HeroFallback'
import { ICON_SM } from '@/components/site/icon'
import ProfileMark from '@/components/site/ProfileMark'
import Manifesto from '@/components/site/home/Manifesto'
import RecordSection, { type RecordItem } from '@/components/site/home/RecordSection'
import ProjectScatter from '@/components/site/home/ProjectScatter'
import StackCloud from '@/components/site/home/StackCloud'
import ContactComposer from '@/components/site/home/ContactComposer'
import PathStrip from '@/components/site/home/PathStrip'
import Colophon from '@/components/site/home/Colophon'
import QandA from '@/components/site/home/QandA'
import { profile } from '@/data/profile'
import { fallbackRepos, featuredRepoFullNames } from '@/data/featuredRepos'
import { categoryLabels, techStackByCategory } from '@/data/techStack'
import { timelineEvents } from '@/data/timeline'

// HeroScene 懒加载：Three.js 不进入主包
const HeroScene = lazy(() => import('@/components/site/HeroScene'))

/** 首页分区编号,与 SectionLabel 的 [ N.00x ] 一致 */
const N = {
  home: 1,
  about: 2,
  record: 3,
  path: 4,
  writing: 5,
  projects: 6,
  stack: 7,
  colophon: 8,
  qa: 9,
  contact: 10,
} as const
const CONTACT_ID = 'contact'
const SOURCE_REPO_URL = 'https://github.com/TF49/personal-blog'
const RECENT_LIMIT = 6

const focusAreas = [
  {
    index: '01',
    eyebrow: 'FULL-STACK SYSTEMS',
    title: '完整系统',
    description: '从服务端、移动端到现代前端，关注真正能够交付、维护和持续演进的产品系统。',
  },
  {
    index: '02',
    eyebrow: 'AI TOOLING',
    title: 'AI 工具链',
    description: '把模型能力接入真实研发流程，探索更可靠、更顺手的工程化工具与协作方式。',
  },
  {
    index: '03',
    eyebrow: 'ENGINEERING NOTES',
    title: '工程写作',
    description: '记录问题如何被拆解、方案如何取舍，以及一个系统从想法走到落地的完整过程。',
  },
] as const

const techCount = Object.values(techStackByCategory).reduce((sum, list) => sum + list.length, 0)
const techGroups = Object.keys(techStackByCategory).length
const repoLanguages = Array.from(new Set(fallbackRepos.map((r) => r.language).filter(Boolean))).join(' · ')

export default function Home() {
  const [introDone, setIntroDone] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  // 先用本地精选仓库渲染(无布局跳动),GitHub API 返回后替换为实时数据
  const [repos, setRepos] = useState<{ list: GitHubRepo[]; live: boolean }>({ list: fallbackRepos, live: false })

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => {
        document.dispatchEvent(new Event('prerender-ready'))
      })
  }, [])

  useEffect(() => {
    let cancelled = false
    getPinnedRepos(featuredRepoFullNames)
      .then(({ repos: list }) => {
        if (cancelled || list.length === 0) return
        setRepos({ list, live: list.some((r) => !fallbackRepos.includes(r)) })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const recent = articles.slice(0, RECENT_LIMIT)

  const records: RecordItem[] = [
    { value: articles.length, unit: '篇', title: '技术文章', detail: '由 GitHub Issues 同步发布，记录问题、方案与复盘' },
    { value: fallbackRepos.length, unit: '个', title: '精选开源仓库', detail: repoLanguages },
    { value: techCount, unit: '项', title: '常用技术', detail: `覆盖 ${techGroups} 个方向，从语言到运维工具` },
    { value: timelineEvents.length, unit: '段', title: '成长阶段', detail: '从课程学习、实训上线到独立开发' },
  ]

  return (
    <>
      <SEO
        title="首页"
        description={`${profile.name}的个人博客，聚焦全栈开发、AI 工具链、Linux 运维实践与技术文章。`}
      />

      {/* 加载页（每会话一次，自动跳过 reduced-motion / prerender） */}
      {!introDone && <IntroLoader onDone={() => setIntroDone(true)} />}

      {/* ========== N.001 首屏 + 宣言 ========== */}
      <ToneSection tone="sage" as="section" aria-label="首屏">
        {/* HeroScene 懒加载;降级逻辑在 HeroScene 内部完成 */}
        <Suspense fallback={<HeroFallback title={profile.title} subtitle={profile.name} />}>
          <HeroScene title={profile.title} subtitle={profile.name} />
        </Suspense>
        <Manifesto
          statement="代码会过时，做判断的方法不会。"
          note="这里写下的不是标准答案，而是每一次取舍的理由：问题从哪里来、为什么这样拆、上线之后又学到了什么。"
        />
      </ToneSection>

      {/* ========== N.002 关于 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="about-heading" className="relative overflow-hidden">
        <div className="site-wrap relative py-24 md:py-32">
          <SectionLabel label="ABOUT" index={N.about} />

          <GhostHeading
            lines={['ENGINE', 'ERING', 'NOTES', 'FROM', 'TF49']}
            indents={['0', '6%', '42%', '30%', '55%']}
            className="absolute inset-x-0 top-36 md:top-40"
          />

          <div className="relative z-10 grid items-center gap-12 pt-24 md:min-h-[760px] md:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)] md:gap-20 md:pt-[420px]">
            <figure className="mx-auto flex w-full max-w-[300px] flex-col items-center md:max-w-[360px]">
              <ProfileMark className="w-full opacity-80" />
              <figcaption className="mt-5 flex w-full items-center justify-between border-t border-line pt-4 text-label text-fg-muted">
                <span>TF49 / PROFILE</span>
                <span aria-hidden="true">{new Date().getFullYear()}</span>
              </figcaption>
            </figure>

            <div className="max-w-[680px] md:justify-self-end">
              <p className="text-label text-fg-muted">工程、写作与持续构建</p>
              <h2 id="about-heading" className="mt-4 text-h1 font-semibold text-fg">
                {profile.name}
              </h2>
              <div className="mt-8">
                <LetterAssembly text={profile.bio} />
              </div>
              <Link
                to="/about"
                className="mt-10 inline-flex min-h-11 items-center gap-3 rounded-pill border border-line px-6 text-label text-fg transition-[background-color,color,border-color] duration-200 hover:border-fg hover:bg-sage hover:text-ink"
              >
                关于我
                <ArrowUpRightIcon {...ICON_SM} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-20 border-y border-line md:mt-32">
            <div className="grid gap-4 py-8 md:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.28fr)] md:items-end md:gap-12 md:py-10">
              <div>
                <p className="text-label text-fg-muted">CURRENT FOCUS / {new Date().getFullYear()}</p>
                <h3 className="mt-3 text-h2 font-medium text-fg">当前关注</h3>
              </div>
              <p className="max-w-[620px] text-body text-fg-muted md:justify-self-end">
                技术选择会变化，但判断一项工作是否值得长期投入的标准不变：它是否解决真实问题，是否能够被清楚地理解与维护。
              </p>
            </div>

            <ol className="grid border-t border-line md:grid-cols-3">
              {focusAreas.map((area, index) => (
                <li
                  key={area.index}
                  className={[
                    'py-8 md:min-h-[248px] md:py-10',
                    index > 0 ? 'border-t border-line md:border-l md:border-t-0 md:pl-8' : '',
                    index < focusAreas.length - 1 ? 'md:pr-8' : '',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-4 text-label text-fg-muted">
                    <span>{area.index}</span>
                    <span>{area.eyebrow}</span>
                  </div>
                  <h4 className="mt-10 text-h2 font-medium text-fg">{area.title}</h4>
                  <p className="mt-4 text-body text-fg-muted">{area.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </ToneSection>

      {/* ========== N.003 记录 ========== */}
      <ToneSection tone="sage" as="section" aria-labelledby="record-heading" className="relative overflow-hidden">
        <RecordSection headline={techCount} items={records} index={N.record} />
      </ToneSection>

      {/* ========== N.004 历程 ========== */}
      <ToneSection tone="sage" as="section" aria-labelledby="path-heading" className="border-t border-line-sage">
        <PathStrip events={timelineEvents} index={N.path} />
      </ToneSection>

      {/* ========== N.005 最新文章 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="posts-heading">
        <div className="site-wrap py-24 md:py-32">
          <SectionLabel label="WRITING" index={N.writing} className="mb-8" />
          <div className="mb-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,430px)] md:items-end">
            <div>
              <h2 id="posts-heading" className="text-h1 font-semibold text-fg">
                最新文章
              </h2>
              <p className="mt-5 max-w-[540px] text-body text-fg-muted">
                这里收录开发中的判断、踩坑与复盘。比起给出唯一答案，我更希望保留问题发生的背景和方案取舍的过程。
              </p>
            </div>
            <div className="hidden items-end justify-between border-t border-line pt-5 sm:flex">
              <span className="text-label text-fg-muted">
                {recent.length > 0 ? `${recent.length} 篇近期记录` : '近期记录'}
              </span>
              <Link
                to="/blog"
                className="inline-flex min-h-11 items-center border-b border-line text-label text-fg-muted transition-colors hover:text-fg"
              >
                全部文章 →
              </Link>
            </div>
          </div>

          <PostIndex articles={recent} />

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

      {/* ========== N.006 项目 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="projects-heading" className="border-t border-line-ink">
        <ProjectScatter repos={repos.list} live={repos.live} index={N.projects} />
      </ToneSection>

      {/* ========== N.007 技术栈 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="stack-heading">
        <StackCloud groups={techStackByCategory} labels={categoryLabels} index={N.stack} />
      </ToneSection>

      {/* ========== N.008 本站构建 ========== */}
      <ToneSection tone="sage" as="section" aria-labelledby="colophon-heading">
        <Colophon index={N.colophon} repoUrl={SOURCE_REPO_URL} />
      </ToneSection>

      {/* ========== N.009 问答 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="qa-heading">
        <QandA index={N.qa} email={profile.email} contactId={CONTACT_ID} />
      </ToneSection>

      {/* ========== N.010 写信 ========== */}
      <ToneSection
        id={CONTACT_ID}
        tone="sage"
        as="section"
        aria-labelledby="contact-heading"
        className="scroll-mt-[var(--header-h)] border-b border-line-sage"
      >
        <ContactComposer email={profile.email} index={N.contact} />
      </ToneSection>
    </>
  )
}

import { useEffect, useState } from 'react'
import { getPinnedRepos, getProfile, getTechStack, getTimeline } from '@/api'
import { categoryLabels } from '@/data/techStack'
import { fallbackRepos, featuredRepoFullNames } from '@/data/featuredRepos'
import type { AuthorProfile, GitHubRepo } from '@/types'
import SEO from '@/components/SEO'
import ToneSection from '@/components/site/ToneSection'
import SectionLabel from '@/components/site/SectionLabel'
import Timeline from '@/components/site/Timeline'
import RepoList from '@/components/site/RepoList'
import ProfileMark from '@/components/site/ProfileMark'

type RepoState = { list: GitHubRepo[]; live: boolean }

export default function About() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null)
  const [repos, setRepos] = useState<RepoState | null>(null)
  const [timeline] = useState(getTimeline)
  const [techStack] = useState(getTechStack)

  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((p) => {
        if (!cancelled) setProfile(p)
      })
      .finally(() => document.dispatchEvent(new Event('prerender-ready')))
    return () => {
      cancelled = true
    }
  }, [])

  // 精选仓库:接口失败时 getPinnedRepos 返回本地兜底数据,照常展示,但不显示星标数
  useEffect(() => {
    let cancelled = false
    getPinnedRepos(featuredRepoFullNames)
      .then(({ repos: list }) => {
        if (cancelled) return
        const live = list.some((r) => !fallbackRepos.includes(r))
        setRepos({ list, live })
      })
      .catch(() => {
        if (!cancelled) setRepos(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!profile) {
    return (
      <ToneSection tone="ink" as="div" className="flex min-h-screen items-center justify-center pt-[64px]">
        <p className="text-label text-fg-muted">加载中…</p>
      </ToneSection>
    )
  }

  const github = profile.social.find((s) => s.name === 'GitHub' && s.url && s.url !== '#')
  let sectionIndex = 1

  return (
    <>
      <SEO title="关于" description={`${profile.name} · ${profile.title}`} />

      {/* ========== 简介 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="about-title" className="pt-[64px]">
        <div className="site-wrap pb-24 pt-24 md:pb-32">
          <SectionLabel label="ABOUT" index={sectionIndex++} />
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,720px)] lg:gap-16">
            <div>
              <h1 id="about-title" className="text-h1 font-semibold">
                {profile.name}
              </h1>
              <p className="mt-4 text-body text-fg-muted">{profile.title}</p>
              <ProfileMark className="mt-10 w-36 opacity-70 md:mt-14 md:w-52" />
            </div>
            <div>
              <p className="text-body-lg">{profile.bio}</p>
              <dl className="mt-12 grid gap-6 border-t border-line pt-8 text-body sm:grid-cols-3">
                <div>
                  <dt className="text-label text-fg-muted">邮件</dt>
                  <dd className="mt-2 break-all">
                    <a href={`mailto:${profile.email}`} className="underline decoration-1 underline-offset-4">
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-fg-muted">微信</dt>
                  <dd className="mt-2">{profile.wechat}</dd>
                </div>
                {profile.location && (
                  <div>
                    <dt className="text-label text-fg-muted">所在地</dt>
                    <dd className="mt-2">{profile.location}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </ToneSection>

      {/* ========== 经历 ========== */}
      <ToneSection tone="sage" as="section" aria-labelledby="timeline-title">
        <div className="site-wrap py-24 md:py-32">
          <SectionLabel label="PATH" index={sectionIndex++} />
          <h2 id="timeline-title" className="mb-12 mt-12 text-center text-h1 font-semibold md:mb-16">
            经历
          </h2>
          <Timeline events={timeline} />
        </div>
      </ToneSection>

      {/* ========== 精选仓库 ========== */}
      {repos && repos.list.length > 0 && (
        <ToneSection tone="ink" as="section" aria-labelledby="repos-title">
          <div className="site-wrap pt-24 md:pt-32">
            <SectionLabel label="WORKS" index={sectionIndex++} />
            <div className="mb-12 mt-12 flex items-end justify-between gap-6">
              <h2 id="repos-title" className="text-h1 font-semibold">
                精选仓库
              </h2>
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center border-b border-line text-label text-fg-muted transition-colors hover:text-fg"
                >
                  GitHub 主页 →<span className="sr-only">(在新标签页打开)</span>
                </a>
              )}
            </div>
            <RepoList repos={repos.list} live={repos.live} />
          </div>
        </ToneSection>
      )}

      {/* ========== 技术栈 ========== */}
      <ToneSection tone="ink" as="section" aria-labelledby="stack-title">
        <div className="site-wrap py-24 md:py-32">
          <SectionLabel label="STACK" index={sectionIndex++} />
          <h2 id="stack-title" className="mb-12 mt-12 text-h1 font-semibold">
            技术栈
          </h2>
          <div className="grid gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(techStack).map(([cat, items]) => (
              <div key={cat}>
                <h3 className="text-label text-fg-muted">{categoryLabels[cat] ?? cat}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-body">
                  {items.map((t) => (
                    <li key={t.name}>{t.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ToneSection>
    </>
  )
}

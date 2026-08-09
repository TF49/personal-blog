import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { GitHubRepo } from '@/types'
import { SpotlightCard, BlurText, ShinyText } from '@/components/reactbits'

type InteractiveLabProps = {
  repos?: GitHubRepo[]
  githubError?: string
}

function formatDate(iso: string) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

import TerminalConsole from '@/components/home/TerminalConsole'

export default function InteractiveLab({ repos, githubError }: InteractiveLabProps) {
  const items = useMemo(() => (repos ?? []).slice(0, 6), [repos])
  const [activeTab, setActiveTab] = useState<string>('')

  useEffect(() => {
    if (!activeTab && items.length > 0) setActiveTab(items[0].full_name)
  }, [activeTab, items])

  const activeRepo = items.find((r) => r.full_name === activeTab) ?? items[0]

  return (
    <section className="section-padding bg-[var(--color-black)] text-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="mb-20">
          <h2 className="font-display text-4xl sm:text-6xl mb-6">
            <BlurText text="全栈" delay={0.1} /> <span className="text-[var(--color-primary)]">实验室 & 运维 Shell</span>
          </h2>
          <p className="text-white/40 text-lg font-light tracking-wide uppercase tracking-[0.3em]">
            <ShinyText text="GitHub 动态与 Terminal 控制台" speed={6} color="#86868b" />
          </p>
        </div>

        <SpotlightCard spotlightColor="rgba(0, 113, 227, 0.2)" className="p-0 overflow-hidden shadow-2xl">
          {items.length === 0 ? (
            <div className="p-12 lg:p-20">
              <div className="text-white/60 font-display text-xl">暂无可展示的 GitHub 仓库数据</div>
              <div className="mt-4 text-white/30 text-sm font-light">
                {githubError ? `GitHub API 加载失败：${githubError}` : '请稍后刷新或检查网络环境。'}
              </div>
            </div>
          ) : (
            <>
              <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                {items.map((repo) => (
                  <button
                    key={repo.full_name}
                    onClick={() => setActiveTab(repo.full_name)}
                    className={`px-8 py-6 font-display text-xs uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${
                      activeTab === repo.full_name ? 'text-[var(--color-primary)] bg-white/5' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {repo.name}
                    {activeTab === repo.full_name && (
                      <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8 lg:p-14 flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-5/12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-6 rounded-full">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                      {activeRepo.archived ? '已归档' : '实时在线'}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl mb-4">{activeRepo.name}</h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed mb-8">
                    {activeRepo.description ?? activeRepo.full_name}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{activeRepo.stargazers_count}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">Stars</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{activeRepo.forks_count}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">Forks</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{formatDate(activeRepo.updated_at)}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">Updated</div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-7/12 w-full">
                  <TerminalConsole />
                </div>
              </div>
            </>
          )}
        </SpotlightCard>
      </div>
    </section>
  )
}


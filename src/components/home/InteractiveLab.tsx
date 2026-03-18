import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { GitHubRepo } from '@/types'

type InteractiveLabProps = {
  repos?: GitHubRepo[]
  githubError?: string
}

function formatDate(iso: string) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

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
            项目 <span className="text-[var(--color-primary)]">实验室</span>
          </h2>
          <p className="text-white/40 text-lg font-light tracking-wide uppercase tracking-[0.3em]">GitHub 实时数据</p>
        </div>

        <div className="bg-[#111] border border-white/5 shadow-2xl overflow-hidden">
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

              <div className="p-12 lg:p-20 flex flex-col lg:flex-row gap-20 items-center">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-8">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                      {activeRepo.archived ? '已归档' : '活跃'}
                    </span>
                  </div>
                  <h3 className="font-display text-4xl mb-6">{activeRepo.name}</h3>
                  <p className="text-white/40 text-lg font-light leading-relaxed mb-12">
                    {activeRepo.description ?? activeRepo.full_name}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{activeRepo.stargazers_count}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/20">Stars</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{activeRepo.forks_count}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/20">Forks</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-primary)] font-display text-2xl mb-1">{formatDate(activeRepo.updated_at)}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/20">Updated</div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2 w-full aspect-video bg-black/40 border border-white/5 relative flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 opacity-20">
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] blur-3xl" />
                   </div>
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.1, 1],
                       rotate: [0, 5, -5, 0]
                     }}
                     transition={{ duration: 10, repeat: Infinity }}
                     className="relative z-10 w-32 h-32 border-2 border-[var(--color-primary)] rounded-full flex items-center justify-center"
                   >
                     <div className="w-20 h-20 border border-[var(--color-primary)]/40 rounded-full animate-ping" />
                     <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-xl" />
                   </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

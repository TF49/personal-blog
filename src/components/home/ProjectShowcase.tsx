import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Star } from 'lucide-react'
import { featuredRepoFullNames, getFeaturedRepos, getPinnedRepos, getRepoOgImageUrl } from '@/api'
import type { GitHubRepo } from '@/types'
import { TiltedCard, TextScramble, BlurText, Magnet } from '@/components/reactbits'

export default function ProjectShowcase() {
  const username = 'TF49'
  const [loading, setLoading] = useState(true)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    const hasPinned = featuredRepoFullNames.length > 0

    const load = async () => {
      setLoading(true)
      const result = hasPinned
        ? await getPinnedRepos(featuredRepoFullNames)
        : await getFeaturedRepos(username, { limit: 4 })

      if (cancelled) return
      setRepos(result.repos)
      setError(result.error)
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="section-padding bg-[var(--color-black)] relative overflow-hidden">
      {/* 背景点状装饰 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-white/5 pb-12">
          <div className="md:w-1/2">
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-8 tracking-tighter">
              <BlurText text="精选" delay={0.1} /> <span className="text-[var(--color-primary)]">作品</span>
            </h2>
            <p className="text-white/40 text-xl font-light max-w-md">通过代码与设计突破界限，驱动 Web 开发的未来。</p>
          </div>
          <Magnet strength={0.25}>
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-[var(--color-primary)] transition-all group py-4 px-8 border border-white/10 hover:border-[var(--color-primary)] rounded-full backdrop-blur-md"
            >
              查看 GitHub 仓库 <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2" />
            </a>
          </Magnet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {loading ? (
            <div className="col-span-full">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10">
                <p className="text-white/70 text-sm tracking-wider">
                  正在从 GitHub 加载精选仓库…
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[16/11] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : repos.length > 0 ? (
            repos.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
              >
                <TiltedCard maxRotation={8} scaleOnHover={1.02} className="aspect-[16/11]">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative w-full h-full cursor-pointer block overflow-hidden rounded-2xl"
                  >
                    <img
                      src={getRepoOgImageUrl(repo.full_name)}
                      alt={repo.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-40 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

                    <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end">
                      <div className="overflow-hidden mb-3">
                        <div className="text-[var(--color-primary)] text-[10px] font-bold tracking-[0.4em] uppercase">
                          <TextScramble text={repo.language ?? 'Repository'} />
                        </div>
                      </div>
                      <h3 className="text-white font-display text-2xl sm:text-4xl mb-4 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {repo.name}
                      </h3>
                      <div className="flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="min-w-0">
                          <p className="text-white/60 text-xs sm:text-sm font-medium tracking-wider line-clamp-1">
                            {repo.description ?? repo.full_name}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-white/50 text-xs font-semibold tracking-wider">
                            <span className="inline-flex items-center gap-2 text-amber-400">
                              <Star className="w-4 h-4 fill-amber-400/20" />
                              {repo.stargazers_count}
                            </span>
                            <span className="text-white/25">/</span>
                            <span>Updated {repo.updated_at.slice(0, 10)}</span>
                          </div>
                        </div>
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-all duration-300">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/20 group-hover:border-[var(--color-primary)] transition-colors" />
                    <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/20 group-hover:border-[var(--color-primary)] transition-colors" />
                  </a>
                </TiltedCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10">
                <p className="text-white/70 text-sm tracking-wider">
                  GitHub 数据加载失败。
                </p>
                {error && (
                  <p className="mt-3 text-white/35 text-xs tracking-wider">
                    {error}（可稍后刷新，或直接访问 GitHub 查看）
                  </p>
                )}
                <a
                  href={`https://github.com/${username}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-[var(--color-primary)] transition-all group py-4 px-8 border border-white/10 hover:border-[var(--color-primary)] rounded-full backdrop-blur-md"
                >
                  查看 GitHub 仓库 <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


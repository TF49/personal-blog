import { cloneElement, ReactElement } from 'react'
import { Code, Terminal, Layers, Layout, Database, Cpu, Share2, Zap } from 'lucide-react'

export default function TechStackMarquee() {
  const techs = [
    { name: 'React', icon: <Code /> },
    { name: 'Spring Boot', icon: <Terminal /> },
    { name: 'Next.js', icon: <Layers /> },
    { name: 'Tailwind', icon: <Layout /> },
    { name: 'Docker', icon: <Database /> },
    { name: 'TypeScript', icon: <Cpu /> },
    { name: 'Kubernetes', icon: <Share2 /> },
    { name: 'Framer Motion', icon: <Zap /> }
  ]

  return (
    <section className="py-24 bg-[var(--color-black)] overflow-hidden border-y border-white/5 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      <div className="flex flex-col gap-16 relative z-10">
        <div className="flex marquee-content gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {techs.map((tech) => (
                <div key={tech.name} className="flex flex-col items-center justify-center w-40 h-40 bg-white/[0.02] border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-700 group cursor-default">
                  <div className="text-[var(--color-primary)] group-hover:scale-125 transition-transform duration-500 mb-4 opacity-50 group-hover:opacity-100">
                    {cloneElement(tech.icon as ReactElement, { size: 32 })}
                  </div>
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex marquee-content-reverse gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {techs.slice().reverse().map((tech) => (
                <div key={tech.name} className="flex flex-col items-center justify-center w-40 h-40 bg-white/[0.02] border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-700 group cursor-default">
                  <div className="text-[var(--color-primary)] group-hover:scale-125 transition-transform duration-500 mb-4 opacity-50 group-hover:opacity-100">
                    {cloneElement(tech.icon as ReactElement, { size: 32 })}
                  </div>
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

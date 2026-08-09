import { cloneElement, ReactElement } from 'react'
import { Code, Terminal, Layers, Layout, Database, Cpu, Share2, Zap } from 'lucide-react'

interface TechItem {
  name: string
  icon: ReactElement
}

export default function TechStackMarquee() {
  const row1Techs: TechItem[] = [
    { name: 'REACT', icon: <Code /> },
    { name: 'SPRING BOOT', icon: <Terminal /> },
    { name: 'NEXT.JS', icon: <Layers /> },
    { name: 'TAILWIND', icon: <Layout /> },
    { name: 'DOCKER', icon: <Database /> },
    { name: 'TYPESCRIPT', icon: <Cpu /> },
    { name: 'KUBERNETES', icon: <Share2 /> },
    { name: 'FRAMER MOTION', icon: <Zap /> },
  ]

  const row2Techs: TechItem[] = [
    { name: 'DOCKER', icon: <Database /> },
    { name: 'TAILWIND', icon: <Layout /> },
    { name: 'NEXT.JS', icon: <Layers /> },
    { name: 'SPRING BOOT', icon: <Terminal /> },
    { name: 'REACT', icon: <Code /> },
    { name: 'FRAMER MOTION', icon: <Zap /> },
    { name: 'KUBERNETES', icon: <Share2 /> },
    { name: 'TYPESCRIPT', icon: <Cpu /> },
  ]

  return (
    <section className="py-16 sm:py-20 bg-black relative overflow-hidden border-t border-white/[0.08]">
      {/* Edge gradient masks for smooth fade */}
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

      <div className="flex flex-col gap-6 marquee-container relative z-10">
        {/* Row 1: Scroll Left */}
        <div className="flex w-max animate-marquee-left gap-6">
          {[...row1Techs, ...row1Techs, ...row1Techs, ...row1Techs].map((tech, i) => (
            <div
              key={`row1-${tech.name}-${i}`}
              className="w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 rounded-2xl bg-[#0c0c0e] border border-white/10 hover:border-[var(--color-primary)]/60 hover:bg-[#121216] transition-all duration-300 flex flex-col items-center justify-center p-4 group cursor-pointer hover:scale-105 hover:shadow-[0_0_25px_rgba(0,113,227,0.25)]"
            >
              <div className="text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300 mb-3">
                {cloneElement(tech.icon, { size: 36, strokeWidth: 1.8 })}
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Scroll Right */}
        <div className="flex w-max animate-marquee-right gap-6">
          {[...row2Techs, ...row2Techs, ...row2Techs, ...row2Techs].map((tech, i) => (
            <div
              key={`row2-${tech.name}-${i}`}
              className="w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 rounded-2xl bg-[#0c0c0e] border border-white/10 hover:border-[var(--color-primary)]/60 hover:bg-[#121216] transition-all duration-300 flex flex-col items-center justify-center p-4 group cursor-pointer hover:scale-105 hover:shadow-[0_0_25px_rgba(0,113,227,0.25)]"
            >
              <div className="text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300 mb-3">
                {cloneElement(tech.icon, { size: 36, strokeWidth: 1.8 })}
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


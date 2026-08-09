import { useState, useEffect } from 'react'
import { Terminal, ShieldCheck, Cpu, HardDrive, Play } from 'lucide-react'
import { TextScramble } from '@/components/reactbits'

const COMMAND_HISTORY: Record<string, string[]> = {
  'systemctl status blog-service': [
    '● blog-service.service - Personal Developer Matrix Engine',
    '   Loaded: loaded (/etc/systemd/system/blog-service.service; enabled)',
    '   Active: active (running) since Sun 2026-08-09 15:50:00 CST',
    '   Main PID: 4096 (vite-node)',
    '   Tasks: 18 (limit: 4915)',
    '   Memory: 142.4M (max: 2.0G)',
    '   CPU: 420ms (User: 310ms, System: 110ms)',
    '   CGroup: /system.slice/blog-service.service',
    '           └─4096 /usr/bin/node dist/server.js',
  ],
  'docker ps': [
    'CONTAINER ID   IMAGE                 COMMAND                  CREATED        STATUS        PORTS',
    'a9f81b2c3d4e   nginx:alpine          "/docker-entrypoint.…"   2 days ago     Up 48 hours   0.0.0.0:80->80/tcp',
    'c7d6e5f4a3b2   redis:7-alpine        "docker-entrypoint.s…"   5 days ago     Up 5 days     6379/tcp',
    'e1f2a3b4c5d6   postgres:16-alpine    "docker-entrypoint.s…"   1 week ago     Up 7 days     5432/tcp',
  ],
  'uname -a': [
    'Linux TF49-Dev-Station 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC UTC 2026 x86_64 x86_64 x86_64 GNU/Linux',
  ],
  'git log --oneline -n 3': [
    '7a9b1c2 feat(ui): implement GSAP scrolltrigger & ReactBits dynamics',
    '3d4e5f6 refactor(hero): update side-by-side grid & tech stack stack',
    '1a2b3c4 chore(deps): upgrade framer-motion and lenis smooth scroll',
  ],
}

export default function TerminalConsole() {
  const [activeCmd, setActiveCmd] = useState<string>('systemctl status blog-service')
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const runCommand = (cmdKey: string) => {
    if (isTyping) return
    setActiveCmd(cmdKey)
    setIsTyping(true)
    setDisplayedLines([])

    const lines = COMMAND_HISTORY[cmdKey] || ['Command executed successfully.']
    let currentLine = 0

    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        const lineToAdd = lines[currentLine]
        setDisplayedLines((prev: string[]) => [...prev, lineToAdd])
        currentLine++
      } else {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 120)
  }

  useEffect(() => {
    runCommand('systemctl status blog-service')
  }, [])

  return (
    <div className="w-full rounded-2xl bg-[#0d0d12]/90 border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-white/50 flex items-center gap-2">
            <Terminal size={14} className="text-[var(--color-primary)]" />
            root@TF49-Node:~#
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
          <span className="flex items-center gap-1">
            <Cpu size={12} className="text-emerald-400" /> CPU 1.2%
          </span>
          <span className="flex items-center gap-1">
            <HardDrive size={12} className="text-sky-400" /> RAM 142MB
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-[var(--color-primary)]" /> ONLINE
          </span>
        </div>
      </div>

      {/* Command Selector Buttons */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar text-xs font-mono">
        {Object.keys(COMMAND_HISTORY).map((cmd) => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            disabled={isTyping}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 shrink-0 ${
              activeCmd === cmd
                ? 'bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-white'
                : 'bg-white/5 border border-white/5 text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <Play size={10} className={activeCmd === cmd ? 'text-[var(--color-primary)]' : 'text-white/30'} />
            {cmd.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Terminal Display Content */}
      <div className="p-6 font-mono text-xs leading-relaxed space-y-2 text-white/80 min-h-[220px] max-h-[300px] overflow-y-auto">
        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
          <span>root@TF49-Dev-Station:~#</span>
          <TextScramble text={activeCmd} speed={30} />
        </div>

        {displayedLines.map((line: string, idx: number) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap font-mono ${
              line.startsWith('●')
                ? 'text-emerald-400 font-bold'
                : line.includes('Active: active')
                ? 'text-emerald-300'
                : line.startsWith('CONTAINER') || line.startsWith('Linux')
                ? 'text-sky-300 font-semibold'
                : 'text-white/70'
            }`}
          >
            {line}
          </div>
        ))}

        {/* Blinking cursor */}
        <div className="inline-flex items-center gap-1 text-[var(--color-primary)] font-bold pt-1">
          <span>root@TF49-Node:~#</span>
          <span className="w-2 h-4 bg-[var(--color-primary)] animate-pulse inline-block align-middle ml-1" />
        </div>
      </div>
    </div>
  )
}

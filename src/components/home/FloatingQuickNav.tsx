import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type NavItem = {
  id: string
  label: string
  short: string
}

interface FloatingQuickNavProps {
  items: NavItem[]
}

export default function FloatingQuickNav({ items }: FloatingQuickNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  const sectionIds = useMemo(() => items.map((item) => item.id), [items])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) {
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id)
            }
          })
        },
        {
          rootMargin: '-35% 0px -45% 0px',
          threshold: 0.2,
        },
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sectionIds])

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="rounded-[28px] border border-white/12 bg-black/45 px-3 py-4 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const isActive = item.id === activeId
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group relative flex items-center justify-end"
                aria-label={item.label}
              >
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 8,
                  }}
                  className="mr-3 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70"
                >
                  {item.label}
                </motion.span>
                <motion.span
                  animate={{
                    backgroundColor: isActive ? 'rgba(246,181,0,1)' : 'rgba(255,255,255,0.14)',
                    width: isActive ? 40 : 32,
                  }}
                  className="flex h-10 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-[0.28em] text-black transition-colors group-hover:bg-[var(--color-primary)]"
                >
                  <span className={isActive ? 'text-black' : 'text-white/70 group-hover:text-black'}>{item.short}</span>
                </motion.span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

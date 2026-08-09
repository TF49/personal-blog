import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { profile } from '@/data/profile'
import { Magnet, ShinyText } from '@/components/reactbits'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/about', label: '关于' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = location.pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome 
          ? 'bg-[#161617]/85 backdrop-blur-[20px] border-b border-white/[0.08] py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-wide px-6 lg:px-12 flex items-center justify-between">
        <Magnet strength={0.2}>
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-display text-xl tracking-tight text-white transition-all duration-300 hover:opacity-80"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold text-white transition-transform duration-300 group-hover:scale-105">
              TF
            </span>
            <span className="leading-none text-sm font-medium tracking-tight">
              <ShinyText text={profile.name} speed={6} />
              <span className="ml-1 text-white/45 font-light">Blog</span>
            </span>
          </Link>
        </Magnet>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map(({ to, label }) => (
            <Magnet key={to} strength={0.15}>
              <Link
                to={to}
                className={`text-xs font-normal tracking-wide transition-all duration-300 relative group py-1 ${
                  location.pathname === to
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
                <span className={`absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full ${location.pathname === to ? 'w-full' : ''}`} />
              </Link>
            </Magnet>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-8">
          <Magnet strength={0.25}>
            <Link 
              to="/about" 
              className="px-4 py-1.5 text-xs font-normal tracking-wide transition-all duration-300 border border-white/15 rounded-full bg-white/5 hover:bg-white hover:text-black hover:border-white backdrop-blur-md block"
            >
              <span>即刻联系</span>
            </Link>
          </Magnet>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="lg:hidden p-2 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="text-white" size={20} />
          ) : (
            <Menu className="text-white" size={20} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-[#161617]/95 backdrop-blur-[20px] border-t border-white/[0.08] shadow-2xl lg:hidden flex flex-col p-6 gap-5"
          >
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-normal tracking-wide ${
                  location.pathname === to ? 'text-white' : 'text-white/60'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-white/10 w-full my-1" />
            <div className="flex items-center justify-end">
              <Link
                to="/about"
                className="bg-white text-black rounded-full px-5 py-2 text-xs font-normal"
                onClick={() => setMobileOpen(false)}
              >
                即刻联系
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


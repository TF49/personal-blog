import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/about', label: '关于' },
]

const langOptions = ['中', 'EN']

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState('中')
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled || !isHome 
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-wide px-6 lg:px-12 flex items-center justify-between">
        <Link
          to="/"
          className={`font-display text-2xl lg:text-3xl tracking-tighter transition-all duration-500 hover:opacity-70 ${
            scrolled || !isHome ? 'text-white' : 'text-white'
          }`}
        >
          NANFU <span className="text-[var(--color-primary)] font-black">BLOG</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-display text-[10px] uppercase tracking-[0.4em] transition-all duration-500 relative group py-2 ${
                scrolled || !isHome
                  ? location.pathname === to
                    ? 'text-[var(--color-primary)]'
                    : 'text-white/70 hover:text-[var(--color-primary)]'
                  : location.pathname === to
                  ? 'text-[var(--color-primary)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {label}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-500 group-hover:w-full ${location.pathname === to ? 'w-full' : ''}`} />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-10">
          <div className={`flex items-center gap-6 text-[10px] font-bold tracking-[0.3em] transition-colors duration-500 ${
            scrolled || !isHome ? 'text-white/60' : 'text-white/40'
          }`}>
            <Globe size={14} className="opacity-50" />
            <div className="flex gap-4">
              {langOptions.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
                    lang === l 
                      ? 'text-[var(--color-primary)]' 
                      : scrolled || !isHome ? 'hover:text-white' : 'hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Link 
            to="/about" 
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 border rounded-full relative overflow-hidden group ${
              scrolled || !isHome 
                ? 'bg-[var(--color-primary)] text-black border-transparent hover:bg-white' 
                : 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white hover:text-black'
            }`}
          >
            <span className="relative z-10">即刻联系</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="lg:hidden p-2 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="text-white" />
          ) : (
            <Menu className="text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-t border-white/10 shadow-xl lg:hidden flex flex-col p-8 gap-6"
          >
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-display text-sm uppercase tracking-widest ${
                  location.pathname === to ? 'text-[var(--color-primary)]' : 'text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-white/10 w-full my-2" />
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs font-bold tracking-widest text-white/40">
                {langOptions.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={lang === l ? 'text-[var(--color-primary)]' : ''}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Link
                to="/about"
                className="bg-[var(--color-primary)] text-black rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-widest"
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

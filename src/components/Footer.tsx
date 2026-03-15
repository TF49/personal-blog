import { Link } from 'react-router-dom'
import { profile } from '@/data/profile'

const products = [
  { to: '/blog', label: '博客文章' },
  { to: '/blog', label: '技术笔记' },
  { to: '/blog', label: '项目总结' },
]

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/about', label: '关于' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div>
            <h3 className="font-display font-normal text-lg uppercase tracking-wider mb-6 text-white/90">
              博客
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              {products.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-normal text-lg uppercase tracking-wider mb-6 text-white/90">
              导航
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-normal text-lg uppercase tracking-wider mb-6 text-white/90">
              关于
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                  {profile.email}
                </a>
              </li>
              <li>微信：{profile.wechat}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-normal text-lg uppercase tracking-wider mb-6 text-white/90">
              涂家乐
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              在校生 · 计算机相关专业 · 热爱编程与折腾
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} 涂家乐 All rights reserved</p>
          <p className="mt-1">Web Designed with ❤</p>
        </div>
      </div>
    </footer>
  )
}

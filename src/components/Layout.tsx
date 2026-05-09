import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { ToastProvider } from './toast/ToastProvider'
import AmbientBackground from './effects/AmbientBackground'

interface LayoutProps {
  children?: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col relative bg-[var(--color-black)]">
        <AmbientBackground />
        <Header />
        <main className="relative z-10 flex-1">
          {children}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </ToastProvider>
  )
}

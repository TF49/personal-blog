import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { ToastProvider } from './toast/ToastProvider'

interface LayoutProps {
  children?: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

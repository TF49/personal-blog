import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import PageTransition from '@/components/PageTransition'

const Home = lazy(() => import('@/pages/Home'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const About = lazy(() => import('@/pages/About'))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-label text-fg-muted" role="status">
      正在加载页面…
    </div>
  )
}

function App() {
  return (
    <Layout>
      <PageTransition>
        {(location) => (
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        )}
      </PageTransition>
    </Layout>
  )
}

export default App

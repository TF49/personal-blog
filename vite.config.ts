import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
// vite-plugin-prerender's ESM build uses `require()` internally; load CJS export to avoid ESM runtime errors.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vitePrerender = require('vite-plugin-prerender')
const enablePrerender = process.env.ENABLE_PRERENDER === 'true'

/** 读取实际安装的依赖版本(而非 package.json 中的范围),供首页 COLOPHON 展示 */
function installedVersion(name: string): string {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'node_modules', name, 'package.json'), 'utf8')
    return (JSON.parse(raw) as { version?: string }).version ?? 'unknown'
  } catch {
    return 'unknown'
  }
}

const buildInfo = {
  builtAt: new Date().toISOString(),
  deps: Object.fromEntries(
    ['react', 'three', 'gsap', 'tailwindcss', 'vite', 'typescript'].map((name) => [name, installedVersion(name)]),
  ),
}

const prerenderPlugin = vitePrerender({
  staticDir: path.join(__dirname, 'dist'),
  routes: (() => {
    const baseRoutes = ['/', '/about', '/blog']
    const articlesPath = path.join(__dirname, 'public', 'articles.json')
    try {
      const raw = fs.readFileSync(articlesPath, 'utf8')
      const articles = JSON.parse(raw) as Array<{ slug?: string }>
      const slugs = articles
        .map((a) => a?.slug)
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      const postRoutes = slugs.map((s) => `/blog/${encodeURIComponent(s)}`)
      return Array.from(new Set([...baseRoutes, ...postRoutes]))
    } catch {
      return baseRoutes
    }
  })(),
  renderer: new vitePrerender.PuppeteerRenderer({
    maxConcurrentRoutes: 2,
    injectProperty: '__PRERENDER_INJECTED',
    inject: { prerender: true },
    renderAfterDocumentEvent: 'prerender-ready',
    navigationOptions: {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    },
    skipThirdPartyRequests: true,
  }),
  minify: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    keepClosingSlash: true,
    sortAttributes: true,
  },
})

export default defineConfig({
  define: {
    __BUILD_INFO__: JSON.stringify(buildInfo),
  },
  plugins: [
    react(),
    ...(enablePrerender ? [prerenderPlugin] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: (() => {
    const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
    return repo ? `/${repo}/` : '/'
  })(),
})

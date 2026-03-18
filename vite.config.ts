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

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
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
        // Effects/data-loading in this app are client-side; give the route a moment to settle.
        // (Using a timed render avoids prerender hangs if an event never fires.)
        renderAfterTime: 2000,
        skipThirdPartyRequests: true,
      }),
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true,
      },
    }),
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

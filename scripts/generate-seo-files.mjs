import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')

function getSiteUrl() {
  const explicit = process.env.SITE_URL?.trim()
  if (explicit) return explicit.endsWith('/') ? explicit : `${explicit}/`

  const repo = process.env.GITHUB_REPOSITORY
  if (repo) {
    const [owner, name] = repo.split('/')
    if (owner && name) return `https://${owner}.github.io/${name}/`
  }
  return 'http://localhost/'
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function loadArticles() {
  try {
    const raw = await fs.readFile(path.join(publicDir, 'articles.json'), 'utf8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })
  const siteUrl = getSiteUrl()
  const articles = await loadArticles()

  const routes = [
    { path: '/', priority: '1.0' },
    { path: '/about', priority: '0.6' },
    { path: '/blog', priority: '0.8' },
    ...articles
      .map((a) => a?.slug)
      .filter((s) => typeof s === 'string' && s.trim().length > 0)
      .map((slug) => ({ path: `/blog/${encodeURIComponent(slug)}`, priority: '0.7' })),
  ]

  const urlset = routes
    .map((r) => {
      const loc = `${siteUrl.replace(/\/$/, '')}${r.path}`
      return [
        '  <url>',
        `    <loc>${xmlEscape(loc)}</loc>`,
        `    <changefreq>weekly</changefreq>`,
        `    <priority>${r.priority}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset,
    '</urlset>',
    '',
  ].join('\n')

  const robots = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteUrl}sitemap.xml`,
    '',
  ].join('\n')

  await Promise.all([
    fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8'),
    fs.writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8'),
  ])
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})


import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const OUTPUT_PUBLIC_FILE = 'public/articles.json'

function env(name, fallback = undefined) {
  const v = process.env[name]
  return v == null || v === '' ? fallback : v
}

function parseRepo(repo) {
  const [ownerRaw, nameRaw] = String(repo ?? '').split('/')
  const owner = ownerRaw?.trim()
  const name = nameRaw?.trim()
  if (!owner || !name) throw new Error(`Invalid BLOG_CONTENT_REPO: "${repo}" (expected "owner/repo")`)
  return { owner, name }
}

function slugify(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-') // allow CJK, collapse others to hyphen
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function stripMarkdown(md) {
  return String(md ?? '')
    .replace(/^---[\s\S]*?---\s*/m, '') // frontmatter
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toISODate(input) {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toISOString().slice(0, 10)
}

async function ghFetchJson(url, { token } = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'personal-blog-articles-generator',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, { headers })
  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.text()
      detail = body ? `\n${body}` : ''
    } catch {
      // ignore
    }
    throw new Error(`GitHub API error ${res.status} for ${url}${detail}`)
  }
  return await res.json()
}

async function listIssues({ owner, repo, label, token }) {
  const perPage = 100
  let page = 1
  const all = []
  while (true) {
    const url =
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
      `/issues?labels=${encodeURIComponent(label)}&state=open&per_page=${perPage}&page=${page}`
    const data = await ghFetchJson(url, { token })
    if (!Array.isArray(data) || data.length === 0) break
    all.push(...data)
    if (data.length < perPage) break
    page += 1
  }
  return all
}

function pickCategory(frontmatterData, labels = []) {
  const fm = frontmatterData?.category
  if (typeof fm === 'string' && fm.trim()) return fm.trim()
  const catLabel = labels.find((l) => typeof l === 'string' && l.startsWith('cat:'))
  if (catLabel) return catLabel.slice('cat:'.length).trim() || '未分类'
  return '未分类'
}

async function main() {
  const repoStr = env('BLOG_CONTENT_REPO', 'TF49/blog-content')
  const label = env('BLOG_ARTICLE_LABEL', 'blog')
  const token = env('BLOG_CONTENT_TOKEN') ?? env('GITHUB_TOKEN')

  const { owner, name: repo } = parseRepo(repoStr)

  const md = new MarkdownIt({
    html: false, // do not allow raw HTML from issues
    linkify: true,
    breaks: true,
  })

  const issues = await listIssues({ owner, repo, label, token })
  const articles = issues
    .filter((it) => !it.pull_request) // exclude PRs
    .map((it) => {
      const issueNumber = it.number
      const issueId = String(it.id)
      const rawBody = it.body ?? ''
      const parsed = matter(rawBody)
      const fm = parsed.data ?? {}
      const contentMd = parsed.content ?? ''

      const title = String(it.title ?? '').trim() || `Issue #${issueNumber}`
      const slug = (typeof fm.slug === 'string' && fm.slug.trim())
        ? fm.slug.trim()
        : `${issueNumber}-${slugify(title)}`

      const date = (typeof fm.date === 'string' && fm.date.trim())
        ? fm.date.trim()
        : toISODate(it.created_at)

      const summary = (typeof fm.summary === 'string' && fm.summary.trim())
        ? fm.summary.trim()
        : stripMarkdown(contentMd).slice(0, 120)

      const labels = Array.isArray(it.labels)
        ? it.labels.map((l) => (typeof l === 'string' ? l : l?.name)).filter(Boolean)
        : []

      const category = pickCategory(fm, labels)

      // Temporary "readCount" stand-in: comments count
      const readCount = typeof it.comments === 'number' ? it.comments : 0

      return {
        id: issueId,
        title,
        slug,
        summary,
        content: md.render(contentMd),
        category,
        date,
        readCount,
      }
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

  const outPath = path.join(process.cwd(), OUTPUT_PUBLIC_FILE)
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, JSON.stringify(articles, null, 2) + '\n', 'utf8')

  process.stdout.write(
    `Generated ${articles.length} articles from ${owner}/${repo} label=${label} -> ${OUTPUT_PUBLIC_FILE}\n`,
  )
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack : String(err)}\n`)
  process.exit(1)
})


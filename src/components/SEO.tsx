import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  imageUrl?: string
  canonicalUrl?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`
  let el = document.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SEO({ title, description, imageUrl, canonicalUrl, noindex, jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | 个人博客`
    document.title = fullTitle

    const desc = description ?? ''
    if (desc) upsertMeta('name', 'description', desc)

    const url = (() => {
      if (canonicalUrl) return canonicalUrl
      const u = new URL(window.location.href)
      u.search = ''
      u.hash = ''
      return u.toString()
    })()

    upsertLink('canonical', url)

    // Open Graph
    upsertMeta('property', 'og:title', fullTitle)
    if (desc) upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', 'website')
    if (imageUrl) upsertMeta('property', 'og:image', imageUrl)

    // Twitter
    upsertMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', fullTitle)
    if (desc) upsertMeta('name', 'twitter:description', desc)
    if (imageUrl) upsertMeta('name', 'twitter:image', imageUrl)

    upsertMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')

    const jsonLdPayload = jsonLd
    const jsonLdId = 'jsonld-seo'
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null
    if (jsonLdPayload) {
      if (!script) {
        script = document.createElement('script')
        script.id = jsonLdId
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.text = JSON.stringify(jsonLdPayload)
    } else if (script) {
      script.remove()
    }
  }, [title, description, imageUrl, canonicalUrl, noindex, jsonLd])

  return null
}

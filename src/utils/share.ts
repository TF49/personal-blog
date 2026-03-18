export type ShareOrCopyInput = {
  title: string
  url: string
  text?: string
}

export type ShareOrCopyResult =
  | { kind: 'shared' }
  | { kind: 'copied' }

export function getShareUrl() {
  return window.location.href
}

async function tryNativeShare(data: ShareData): Promise<boolean> {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  if (!('share' in nav) || typeof nav.share !== 'function') return false

  try {
    if (typeof nav.canShare === 'function') {
      // Some browsers require canShare check (esp. with files); for url/title/text it's usually fine.
      // Still, honor it if present.
      if (!nav.canShare(data)) return false
    }
    await nav.share(data)
    return true
  } catch {
    // User cancel or platform error: treat as not shared, so we can fallback to copy.
    return false
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.top = '0'
  el.style.left = '0'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.focus()
  el.select()

  const ok = document.execCommand('copy')
  document.body.removeChild(el)
  if (!ok) throw new Error('Copy failed')
}

export async function shareOrCopy(input: ShareOrCopyInput): Promise<ShareOrCopyResult> {
  const shared = await tryNativeShare({
    title: input.title,
    text: input.text,
    url: input.url,
  })
  if (shared) return { kind: 'shared' }

  await copyToClipboard(input.url)
  return { kind: 'copied' }
}


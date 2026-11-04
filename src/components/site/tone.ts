import { useSyncExternalStore } from 'react'

/** 分区色调:绿底(sage)或黑底(ink) */
export type Tone = 'sage' | 'ink'

/** 完整类名写死,保证 Tailwind 扫描得到 */
export const toneClass: Record<Tone, string> = {
  sage: 'tone-sage',
  ink: 'tone-ink',
}

/** 没有任何分区覆盖导航栏时使用的色调(与 body 默认一致) */
const DEFAULT_TONE: Tone = 'ink'

/** 导航栏探测线:导航高 64px,取中线 */
export const HEADER_PROBE_PX = 32

// 当前覆盖探测线的分区,按进入顺序排列;最后进入的生效
const activeSections = new Map<symbol, Tone>()
const listeners = new Set<() => void>()
let currentTone: Tone = DEFAULT_TONE

function emit() {
  let next: Tone = DEFAULT_TONE
  for (const tone of activeSections.values()) next = tone
  if (next === currentTone) return
  currentTone = next
  listeners.forEach((listener) => listener())
}

export function enterTone(id: symbol, tone: Tone) {
  activeSections.delete(id)
  activeSections.set(id, tone)
  emit()
}

export function leaveTone(id: symbol) {
  if (activeSections.delete(id)) emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getTone() {
  return currentTone
}

/** 导航栏下方分区的色调,滚动经过分区边界时硬切换 */
export function useHeaderTone(): Tone {
  return useSyncExternalStore(subscribe, getTone, getTone)
}

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function getMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null
  return window.matchMedia(QUERY)
}

/** 非 React 场景(如动画工具函数)直接读取当前偏好 */
export function prefersReducedMotion(): boolean {
  return getMediaQuery()?.matches ?? false
}

function subscribe(onChange: () => void) {
  const mql = getMediaQuery()
  if (!mql) return () => {}
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

/** 统一读取 prefers-reduced-motion,系统设置变化时组件会重新渲染 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
}

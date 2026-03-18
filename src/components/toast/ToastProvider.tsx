import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Toast, { ToastItem, ToastVariant } from './Toast'

type ToastInput = {
  message: string
  variant?: ToastVariant
  durationMs?: number
}

type ToastApi = {
  push: (input: ToastInput) => void
  success: (message: string, durationMs?: number) => void
  error: (message: string, durationMs?: number) => void
  info: (message: string, durationMs?: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

function safeId() {
  // crypto.randomUUID is not available in all environments; keep a safe fallback.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef(new Map<string, number>())

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (input: ToastInput) => {
      const id = safeId()
      const variant = input.variant ?? 'info'
      const durationMs = input.durationMs ?? 2600
      const item: ToastItem = { id, message: input.message, variant }

      setToasts((prev) => [item, ...prev].slice(0, 4))

      const timer = window.setTimeout(() => remove(id), durationMs)
      timers.current.set(id, timer)
    },
    [remove],
  )

  const api = useMemo<ToastApi>(
    () => ({
      push,
      success: (message, durationMs) => push({ message, durationMs, variant: 'success' }),
      error: (message, durationMs) => push({ message, durationMs, variant: 'error' }),
      info: (message, durationMs) => push({ message, durationMs, variant: 'info' }),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[200] flex flex-col gap-3">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>')
  }
  return ctx
}


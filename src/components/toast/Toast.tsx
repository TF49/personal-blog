import { X } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
}

const variantStyles: Record<ToastVariant, { pill: string; title: string }> = {
  success: { pill: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20', title: 'SUCCESS' },
  error: { pill: 'bg-red-400/15 text-red-300 border-red-400/20', title: 'ERROR' },
  info: { pill: 'bg-white/10 text-white/80 border-white/10', title: 'INFO' },
}

export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastItem
  onClose: (id: string) => void
}) {
  const vs = variantStyles[toast.variant]

  return (
    <div className="toast-enter pointer-events-auto w-[min(92vw,420px)] rounded-2xl border border-white/10 bg-black/92 backdrop-blur-xl shadow-2xl">
      <div className="flex items-start gap-3 p-4">
        <div className={`mt-0.5 shrink-0 rounded-full border px-2 py-1 text-[10px] font-black tracking-[0.25em] ${vs.pill}`}>
          {vs.title}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-snug text-white/90 break-words">{toast.message}</div>
        </div>
        <button
          type="button"
          aria-label="关闭提示"
          className="shrink-0 rounded-full p-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => onClose(toast.id)}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}


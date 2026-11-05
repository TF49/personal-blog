import { XIcon } from '@phosphor-icons/react'
import { ICON_SM } from '@/components/site/icon'

export type ToastVariant = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
}

// 只用两种色相:靠文字标签区分类型,不用红绿色
const variantLabel: Record<ToastVariant, string> = {
  success: '完成',
  error: '出错',
  info: '提示',
}

export default function Toast({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) {
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className="toast-enter tone-ink pointer-events-auto w-[min(92vw,420px)] border border-line"
    >
      <div className="flex items-center gap-3 py-2 pl-4 pr-1">
        <span className="shrink-0 text-label text-fg-muted">{variantLabel[toast.variant]}</span>
        <p className="min-w-0 flex-1 break-words text-body">{toast.message}</p>
        <button
          type="button"
          aria-label="关闭提示"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-fg-muted transition-colors hover:text-fg"
          onClick={() => onClose(toast.id)}
        >
          <XIcon {...ICON_SM} aria-hidden />
        </button>
      </div>
    </div>
  )
}

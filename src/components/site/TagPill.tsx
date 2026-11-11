interface TagPillProps {
  label: string
  active?: boolean
  onClick?: () => void
}

/**
 * Outlined pill button for category filter.
 * Active: filled surface=ink/sage depending on context, text=fg
 * Inactive: outlined border-line, text=fg-muted
 */
export default function TagPill({ label, active = false, onClick }: TagPillProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          'inline-flex min-h-11 items-center text-label px-4 py-1.5 rounded-pill border transition-colors',
          active
            ? 'bg-fg text-surface border-fg'
            : 'border-line text-fg-muted hover:border-fg hover:text-fg',
        ].join(' ')}
      >
        {label}
      </button>
    )
  }

  // Static pill (no onClick) — render as span
  return (
    <span className="text-label px-4 py-1.5 rounded-pill border border-line text-fg-muted">
      {label}
    </span>
  )
}

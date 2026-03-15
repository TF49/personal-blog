interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionTitle({ title, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`text-center mb-12 sm:mb-16 ${className}`}>
      <h2 className="font-display font-normal text-2xl sm:text-3xl lg:text-4xl text-[var(--color-text)] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[var(--color-muted)] text-base sm:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

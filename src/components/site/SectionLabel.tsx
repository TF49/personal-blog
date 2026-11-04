interface SectionLabelProps {
  /** 拉丁标签,如 "ABOUT",渲染为 "( ABOUT. )" */
  label: string
  /** 分区编号,如 1 渲染为 "[ N.001 ]" */
  index?: number
  /** between:标签在左、编号在右(默认);center:单独居中 */
  align?: 'between' | 'center'
  className?: string
}

/**
 * 分区序号标签(装饰性)。屏幕阅读器跳过,分区需另行提供真实标题。
 * 布局按 Max 站截图:圆括号标签在左,方括号编号在右上。
 */
export default function SectionLabel({ label, index, align = 'between', className = '' }: SectionLabelProps) {
  const justify = align === 'center' ? 'justify-center' : 'justify-between'
  return (
    <div aria-hidden="true" className={`flex items-start gap-6 text-label uppercase ${justify} ${className}`.trim()}>
      <span>{`( ${label}. )`}</span>
      {index !== undefined && (
        <span className="text-fg-muted">{`[ N.${String(index).padStart(3, '0')} ]`}</span>
      )}
    </div>
  )
}

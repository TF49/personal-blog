interface RollTextProps {
  text: string
  className?: string
}

/**
 * 悬停滚动文字:两份相同文字上下叠放,父元素(需带 group 类)悬停或聚焦时
 * 整体上移一行,形成"翻牌"效果。第二份 aria-hidden,读屏只读一次。
 * reduced-motion 下不位移(motion-safe)。
 */
export default function RollText({ text, className = '' }: RollTextProps) {
  return (
    <span className={`relative inline-block overflow-hidden align-top leading-[1.4] ${className}`.trim()}>
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:group-hover:-translate-y-full motion-safe:group-focus-visible:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-full block transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-safe:group-hover:-translate-y-full motion-safe:group-focus-visible:-translate-y-full"
      >
        {text}
      </span>
    </span>
  )
}

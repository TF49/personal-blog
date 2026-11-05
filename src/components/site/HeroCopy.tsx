import SectionLabel from './SectionLabel'

interface HeroCopyProps {
  title: string
  subtitle: string
}

/**
 * 首屏文字层,3D 场景和静态回退图共用,保证两者切换时文字位置不变。
 * - 顶部:分区标签;底部:右对齐标语
 * - 桌面端标语宽度不超过视口 40%,石头取景在左侧(见 hero/rockScene.ts),两者不重叠
 * - 文字只放在鼠尾草绿上:墨色 11.17:1,次要文字 5.45:1
 * - data-hero-copy 供截图脚本在生成回退图时隐藏文字
 */
export default function HeroCopy({ title, subtitle }: HeroCopyProps) {
  return (
    <div
      data-hero-copy
      className="pointer-events-none absolute inset-0 flex flex-col justify-between"
      style={{ paddingTop: 'calc(var(--header-h) + 16px)' }}
    >
      <SectionLabel label="HOME" index={1} className="site-wrap" />

      <div className="site-wrap pb-16 md:pb-20">
        <div className="ml-auto flex flex-col items-end text-right md:max-w-[min(30rem,40vw)]">
          {/* 幽灵字:颜色随分区切换,在绿底上是略深一级的绿 */}
          <span aria-hidden="true" className="select-none text-display font-semibold leading-none text-ghost">
            TF49
          </span>
          <h1 className="mt-2 text-h1 font-semibold">{title}</h1>
          <p className="mt-3 text-body text-fg-muted">{subtitle}</p>
          <div aria-hidden="true" className="mt-8 h-px w-24 bg-line" />
        </div>
      </div>
    </div>
  )
}

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
  const [primary, ...secondary] = title.split('·').map((part) => part.trim())

  return (
    <div
      data-hero-copy
      className="pointer-events-none absolute inset-0 flex flex-col justify-between"
      style={{ paddingTop: 'calc(var(--header-h) + 20px)' }}
    >
      <SectionLabel label="HOME" index={1} className="site-wrap" />

      <div className="site-wrap pb-10 md:pb-[clamp(64px,9vh,96px)]">
        <div className="relative ml-auto flex max-w-[21rem] flex-col items-start text-left md:max-w-[min(35rem,43vw)] md:items-end md:text-right">
          <span
            aria-hidden="true"
            className="absolute -top-[0.72em] right-0 select-none text-[clamp(88px,14vw,184px)] font-semibold leading-none text-ghost"
          >
            TF49
          </span>
          <h1 aria-label={title} className="relative z-10">
            <span aria-hidden="true" className="block text-[clamp(42px,4.65vw,67px)] font-semibold leading-[1.02]">
              {primary}
            </span>
            <span aria-hidden="true" className="mt-3 block text-[clamp(21px,2.2vw,31px)] font-medium leading-[1.2]">
              {secondary.join(' · ')}
            </span>
          </h1>
          <div className="relative z-10 mt-5 flex items-center gap-4 md:justify-end">
            <span aria-hidden="true" className="h-px w-10 bg-line md:w-14" />
            <p className="text-label text-fg-muted">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

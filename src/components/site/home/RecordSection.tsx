import RollingDigits from '../RollingDigits'
import SectionLabel from '../SectionLabel'

export interface RecordItem {
  value: number
  unit: string
  title: string
  detail: string
}

interface RecordSectionProps {
  /** 巨型背景数字(装饰) */
  headline: number
  items: RecordItem[]
  index: number
}

/**
 * 记录段(sage)。巨型滚动数字作为幽灵背景,前景是一组真实的计数行。
 * 所有数字都来自站点数据(文章、仓库、技术栈、时间线),不写虚构统计。
 */
export default function RecordSection({ headline, items, index }: RecordSectionProps) {
  return (
    <div className="site-wrap relative py-24 md:py-32">
      <SectionLabel label="RECORD" index={index} />

      {/* 巨型数字:装饰层,居中偏右压在内容后方 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <RollingDigits
          value={headline}
          pad={2}
          mode="scrub"
          className="text-[clamp(220px,43vw,620px)] font-black tracking-[-0.06em] text-[#cbd2c5]"
        />
      </div>

      <div className="relative mt-16 grid gap-8 md:mt-24 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.6fr)] md:items-start md:gap-16">
        <h2 id="record-heading" className="max-w-[16em] text-[clamp(28px,3.2vw,46px)] font-semibold leading-[1.15]">
          从课程作业到独立产品，
          <br className="hidden md:block" />
          一直在把东西做完。
        </h2>
        <p className="max-w-[22em] text-body text-fg-muted md:pt-2">
          这些数字只来自这个站点能核对的数据：同步自 GitHub Issues 的文章、公开的仓库、日常使用的技术和经历过的阶段。
        </p>
      </div>

      <dl className="relative mx-auto mt-20 max-w-[820px] border-b border-line md:mt-40">
        {items.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 border-t border-line py-5 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.1fr)] md:py-6"
          >
            <dt className="col-start-2 row-start-1 text-body font-medium">{item.title}</dt>
            <dd className="col-start-1 row-start-1 text-h2 font-semibold tabular-nums">
              {item.value}
              <span className="ml-1 text-label font-normal text-fg-muted">{item.unit}</span>
            </dd>
            <dd className="col-start-2 row-start-2 text-body text-fg-muted md:col-start-3 md:row-start-1">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

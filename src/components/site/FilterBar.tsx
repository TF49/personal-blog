import TagPill from './TagPill'

interface FilterBarProps {
  categories: string[]
  active: string | null
  onChange: (cat: string | null) => void
}

/**
 * Horizontal filter pill bar.
 * Shows "全部" pill + one pill per category.
 */
export default function FilterBar({ categories, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="文章分类筛选">
      <TagPill
        label="全部"
        active={active === null}
        onClick={() => onChange(null)}
      />
      {categories.map((cat) => (
        <TagPill
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => onChange(active === cat ? null : cat)}
        />
      ))}
    </div>
  )
}

import type { IconWeight } from '@phosphor-icons/react'

/**
 * 图标尺寸令牌。Phosphor 在 256 网格上 regular 描边为 16、bold 为 24,
 * 按下面的组合渲染时,两种尺寸的实际描边都是 1.5px(DESIGN.md 5.3)。
 */
export const ICON_MD = { size: 24, weight: 'regular' as IconWeight }
export const ICON_SM = { size: 16, weight: 'bold' as IconWeight }

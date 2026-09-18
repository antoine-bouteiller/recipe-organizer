import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const searchBar = style({
  alignItems: 'center',
  background: theme.colors.muted,
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  position: 'sticky',
  top: 'var(--screen-header-height)',
  zIndex: 10,
  '@media': { 'screen and (min-width: 768px)': { top: theme.spacing(0) } },
})
export const emptyState = style({ color: theme.colors['muted-foreground'], paddingBlock: theme.spacing(8), textAlign: 'center' })
export const ingredientName = style({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
export const categoryBadge = style({ aspectRatio: '1 / 1', '@media': { 'screen and (min-width: 768px)': { aspectRatio: 'auto' } } })
export const categoryLabel = style({ display: 'none', '@media': { 'screen and (min-width: 768px)': { display: 'block' } } })

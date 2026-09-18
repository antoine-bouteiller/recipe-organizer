import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

export const item = style({
  alignItems: 'center',
  borderBottomWidth: '1px',
  display: 'flex',
  gap: theme.spacing(3),
  paddingBlock: theme.spacing(3),
  selectors: { '&:last-child': { borderBottomWidth: 0 } },
  textAlign: 'left',
  width: '100%',
})
const checkBase = style({
  alignItems: 'center',
  borderColor: `color-mix(in srgb, ${theme.colors['muted-foreground']} 40%, transparent)`,
  borderRadius: theme.radius.full,
  borderWidth: '2px',
  display: 'flex',
  flexShrink: 0,
  height: '22px',
  justifyContent: 'center',
  width: '22px',
})
export const check = styleVariants({
  checked: [checkBase, { background: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors['primary-foreground'] }],
  unchecked: [checkBase],
})
const detailsBase = style({ alignItems: 'center', display: 'flex', flex: '1', gap: theme.spacing(2), justifyContent: 'space-between' })
export const details = styleVariants({
  checked: [detailsBase, { color: theme.colors['muted-foreground'], textDecoration: 'line-through' }],
  unchecked: [detailsBase],
})
export const quantities = style({
  alignItems: 'flex-end',
  color: theme.colors['muted-foreground'],
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.fontSizes.sm,
  fontVariantNumeric: 'tabular-nums',
  fontWeight: theme.fontWeights.semibold,
})
export const fallbackQuantity = style({ fontSize: theme.fontSizes.xs })

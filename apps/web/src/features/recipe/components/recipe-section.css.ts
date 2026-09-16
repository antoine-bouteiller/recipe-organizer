import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

export const ingredients = styleVariants({
  embedded: { listStyle: 'none', margin: 0 },
  standalone: {
    background: theme.colors.card,
    borderRadius: theme.radii['2xl'],
    borderStyle: 'solid',
    borderWidth: '1px',
    listStyle: 'none',
    margin: 0,
    overflow: 'hidden',
    paddingInline: '14px',
  },
})
export const ingredient = style({
  borderBottomWidth: '1px',
  fontSize: '14px',
  lineHeight: '24px',
  margin: 0,
  paddingBlock: '12px',
  selectors: { '&:last-child': { borderBottomWidth: 0 } },
})
export const ingredientLine = style({
  alignItems: 'center',
  display: 'flex',
  gap: '12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const bullet = style({ background: theme.colors.primary, borderRadius: theme.radii.full, flexShrink: 0, height: '6px', width: '6px' })
export const ingredientName = style({ flex: '1' })
export const quantity = style({
  color: theme.colors['muted-foreground'],
  fontVariantNumeric: 'tabular-nums',
  fontWeight: theme.fontWeights.semibold,
})
export const group = style({ marginBottom: '16px', selectors: { '&:last-child': { marginBottom: 0 } } })
export const groupName = style({ fontWeight: theme.fontWeights.semibold, marginBottom: '8px', paddingInline: '4px' })

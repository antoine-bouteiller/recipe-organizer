import { theme } from '@recipe-organizer/design-system/theme'
import { style, styleVariants } from '@vanilla-extract/css'

export const ingredients = styleVariants({
  embedded: { listStyle: 'none', margin: theme.spacing(0) },
  standalone: {
    background: theme.colors.card,
    borderRadius: theme.radius['2xl'],
    borderWidth: '1px',
    listStyle: 'none',
    margin: theme.spacing(0),
    overflow: 'hidden',
    paddingInline: theme.spacing(3.5),
  },
})
export const ingredient = style({
  borderBottomWidth: '1px',
  fontSize: theme.fontSizes.sm,
  lineHeight: '24px',
  margin: theme.spacing(0),
  paddingBlock: theme.spacing(3),
  selectors: { '&:last-child': { borderBottomWidth: 0 } },
})
export const ingredientLine = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(3),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
export const bullet = style({ background: theme.colors.primary, borderRadius: theme.radius.full, flexShrink: 0, height: '6px', width: '6px' })
export const ingredientName = style({ flex: '1' })
export const quantity = style({
  color: theme.colors['muted-foreground'],
  fontVariantNumeric: 'tabular-nums',
  fontWeight: theme.fontWeights.semibold,
})
export const group = style({ marginBottom: theme.spacing(4), selectors: { '&:last-child': { marginBottom: theme.spacing(0) } } })
export const groupName = style({ fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing(2), paddingInline: theme.spacing(1) })

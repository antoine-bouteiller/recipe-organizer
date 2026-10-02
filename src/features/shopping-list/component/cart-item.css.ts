import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const details = style({ alignItems: 'center', display: 'flex', flex: '1', gap: theme.spacing(2), justifyContent: 'space-between' })
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

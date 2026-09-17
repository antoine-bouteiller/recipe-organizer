import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  padding: theme.spacing(6),
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
  padding: theme.spacing(6),
})

export const heading = style({
  fontSize: theme.fontSizes.lg,
  fontWeight: theme.fontWeights.semibold,
  marginBottom: theme.spacing(4),
})

export const container3 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
})

export const text = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
})

export const text2 = style({
  fontSize: theme.fontSizes.sm,
  marginTop: theme.spacing(1),
})

export const container4 = style({
  borderTopWidth: '1px',
  paddingTop: theme.spacing(6),
})

export const heading2 = style({
  fontSize: theme.fontSizes.lg,
  fontWeight: theme.fontWeights.semibold,
  marginBottom: theme.spacing(4),
})

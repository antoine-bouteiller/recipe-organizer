import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  backgroundColor: theme.colors.background,
  height: theme.spacing(48),
  position: 'relative',
})

export const appSurface = style({
  backgroundColor: theme.colors.background,
  color: theme.colors.foreground,
  display: 'grid',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
})

export const contentSurface = style({
  backgroundColor: theme.colors.card,
  color: theme.colors['card-foreground'],
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing(3),
})

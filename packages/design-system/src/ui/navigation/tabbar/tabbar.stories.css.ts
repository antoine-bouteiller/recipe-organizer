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
  borderRadius: theme.radii['2xl'],
  padding: theme.spacing(3),
})

export const mutedForeground = style({ color: theme.colors['muted-foreground'] })
export const accentForeground = style({ color: theme.colors['accent-foreground'] })
export const accentSurface = style({ backgroundColor: theme.colors.accent })

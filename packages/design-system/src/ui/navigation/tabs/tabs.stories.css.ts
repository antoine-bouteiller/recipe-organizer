import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  height: theme.spacing(64),
  width: '100%',
})

export const roleMap = style({
  display: 'flex',
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(2),
})

export const mutedSurface = style({ backgroundColor: theme.colors.muted })
export const mutedForeground = style({ color: theme.colors['muted-foreground'] })
export const cardSurface = style({ backgroundColor: theme.colors.card })
export const cardForeground = style({ color: theme.colors['card-foreground'] })

export const section = style({
  padding: theme.spacing(4),
})

export const section2 = style({
  padding: theme.spacing(4),
})

import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'grid',
  gap: theme.spacing(4),
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    'screen and (min-width: 640px)': {
      gap: theme.spacing(6),
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(4),
  justifyContent: 'center',
  padding: theme.spacing(8),
  textAlign: 'center',
})

export const container3 = style({
  alignItems: 'center',
  background: theme.colors.accent,
  borderRadius: theme.radius.full,
  color: theme.colors.primary,
  display: 'flex',
  height: theme.spacing(16),
  justifyContent: 'center',
  width: theme.spacing(16),
})

export const text = style({
  color: theme.colors['muted-foreground'],
  textWrap: 'balance',
})

export const container4 = style({
  display: 'grid',
  gap: theme.spacing(4),
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    'screen and (min-width: 640px)': {
      gap: theme.spacing(6),
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

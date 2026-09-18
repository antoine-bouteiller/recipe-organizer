import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'block',
  marginBottom: theme.spacing(4),
  width: '100%',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const container2 = style({
  display: 'grid',
  gap: theme.spacing(4),
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const container3 = style({
  cursor: 'pointer',
  height: '100%',
})

export const container4 = style({
  alignItems: 'flex-start',
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(4),
})

export const container5 = style({
  alignItems: 'flex-start',
  display: 'flex',
  flex: '1 1 0%',
  gap: theme.spacing(3),
})

export const container6 = style({
  background: `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)`,
  borderRadius: theme.radius.lg,
  color: theme.colors.primary,
  padding: theme.spacing(2),
})

export const container7 = style({
  flex: '1 1 0%',
})

export const heading = style({
  fontWeight: theme.fontWeights.semibold,
})

export const text = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  marginTop: theme.spacing(1),
})

export const text2 = style({
  color: theme.colors['muted-foreground'],
  flexShrink: 0,
})

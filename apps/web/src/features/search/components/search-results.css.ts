import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const text = style({
  alignItems: 'center',
  background: theme.colors.accent,
  borderRadius: theme.radius.full,
  color: theme.colors.primary,
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing(9),
  justifyContent: 'center',
  width: theme.spacing(9),
})

export const text2 = style({
  vars: {
    '--owner-icon-size': '16px',
  },
  flexShrink: 0,
})

export const container = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(4),
  justifyContent: 'center',
  padding: theme.spacing(8),
  textAlign: 'center',
})

export const container2 = style({
  alignItems: 'center',
  background: theme.colors.accent,
  borderRadius: theme.radius.full,
  color: theme.colors.primary,
  display: 'flex',
  height: theme.spacing(16),
  justifyContent: 'center',
  width: theme.spacing(16),
})

export const text3 = style({
  color: theme.colors['muted-foreground'],
  textWrap: 'balance',
})

export const container3 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
})

export const container4 = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.semibold,
})

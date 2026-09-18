import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(5),
})

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(3),
  justifyContent: 'center',
  padding: theme.spacing(8),
  textAlign: 'center',
})

export const container4 = style({
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
  fontWeight: theme.fontWeights.medium,
  textWrap: 'balance',
})

export const text2 = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  textWrap: 'balance',
})

export const heading = style({
  alignItems: 'center',
  color: theme.colors.primary,
  display: 'flex',
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.semibold,
  gap: theme.spacing(1.5),
  letterSpacing: theme.letterSpacings.wider,
  marginBottom: theme.spacing(2),
  paddingInline: theme.spacing(1),
  textTransform: 'uppercase',
})

export const container5 = style({
  background: theme.colors.card,
  borderRadius: theme.radius['2xl'],
  borderWidth: '1px',
  overflow: 'hidden',
  paddingInline: theme.spacing(3.5),
})

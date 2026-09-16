import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(12px)',
  backdropFilter: 'blur(12px)',
  background: `color-mix(in srgb, ${theme.colors.highlight} 15%, transparent)`,
  borderRadius: theme.radii.xl,
  display: 'flex',
  gap: theme.spacing(2.5),
  justifyContent: 'center',
  padding: theme.spacing(1),
  outline: '1',
  outlineColor: `color-mix(in srgb, ${theme.colors.highlight} 20%, transparent)`,
  width: '100%',
})

export const text = style({
  color: theme.colors['inverse-foreground'],
  fontSize: '13px',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: theme.fontWeights.bold,
  minWidth: theme.spacing(18),
  textAlign: 'center',
})

export const container2 = style({
  alignItems: 'center',
  background: theme.colors.card,
  borderRadius: theme.radii['2xl'],
  borderWidth: '1px',
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(4),
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(3),
})

export const text2 = style({
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.bold,
})

export const container4 = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
})

export const text3 = style({
  fontVariantNumeric: 'tabular-nums',
  fontWeight: theme.fontWeights.bold,
  minWidth: theme.spacing(5),
  textAlign: 'center',
})

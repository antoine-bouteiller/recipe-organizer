import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const root = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  display: 'flex',
  justifyContent: 'center',
  marginBlock: 'auto',
})

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  textAlign: 'center',
})

export const centered = style({
  display: 'flex',
  justifyContent: 'center',
})

export const mark = style({
  height: 'auto',
  width: theme.spacing(48),
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
})

export const heading = style({
  color: theme.colors.foreground,
  fontSize: theme.fontSizes['2xl'],
  fontWeight: theme.fontWeights.semibold,
})

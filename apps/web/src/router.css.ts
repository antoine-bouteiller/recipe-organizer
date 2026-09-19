import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const root = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(6),
  justifyContent: 'center',
  minWidth: theme.spacing(0),
  padding: theme.spacing(4),
})

export const heading = style({
  fontSize: theme.fontSizes['5xl'],
  fontWeight: theme.fontWeights.semibold,
})

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  textAlign: 'center',
})

export const subheading = style({
  fontSize: theme.fontSizes['3xl'],
  fontWeight: theme.fontWeights.semibold,
})

export const details = style({
  borderColor: theme.colors.destructive,
  borderRadius: theme.radius.sm,
  borderWidth: '1px',
  color: theme.colors.destructive,
  fontSize: theme.fontSizes.sm,
  padding: theme.spacing(1),
})

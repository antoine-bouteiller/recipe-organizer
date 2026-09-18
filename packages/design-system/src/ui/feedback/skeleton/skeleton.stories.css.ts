import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const container2 = style({
  borderColor: theme.colors.border,
  borderRadius: theme.radius['2xl'],
  borderWidth: '1px',
  padding: theme.spacing(4),
  width: theme.spacing(80),
})

globalStyle(`.${container2} > * + *`, {
  marginTop: theme.spacing(3),
})

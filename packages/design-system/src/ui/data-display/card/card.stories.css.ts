import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  fontSize: theme.fontSizes.sm,
  padding: theme.spacing(6),
  paddingTop: theme.spacing(0),
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'flex-end',
  padding: theme.spacing(6),
  paddingTop: theme.spacing(0),
})

export const container4 = style({
  fontSize: theme.fontSizes.sm,
  padding: theme.spacing(6),
})

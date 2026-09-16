import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const label2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

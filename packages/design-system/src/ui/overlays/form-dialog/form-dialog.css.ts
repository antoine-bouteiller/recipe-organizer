import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const formClassName = style({
  display: 'contents',
})

export const fieldsClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
})

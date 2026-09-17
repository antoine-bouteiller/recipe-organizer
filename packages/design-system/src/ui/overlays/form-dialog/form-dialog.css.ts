import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const form = style({
  display: 'contents',
})

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
})

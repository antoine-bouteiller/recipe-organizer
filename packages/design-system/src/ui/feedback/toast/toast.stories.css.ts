import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
})

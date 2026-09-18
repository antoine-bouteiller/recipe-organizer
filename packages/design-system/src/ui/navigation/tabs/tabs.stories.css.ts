import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  height: theme.spacing(64),
  width: '100%',
})

export const section = style({
  padding: theme.spacing(4),
})

export const methodPanel = style({
  padding: theme.spacing(4),
})

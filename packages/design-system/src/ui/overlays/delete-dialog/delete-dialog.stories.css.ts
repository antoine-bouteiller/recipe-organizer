import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const container = style({})

globalStyle(`.${container} > * + *`, {
  marginTop: theme.spacing(3),
})

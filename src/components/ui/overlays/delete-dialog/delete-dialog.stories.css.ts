import { style, globalStyle } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const container = style({})

globalStyle(`.${container} > * + *`, {
  marginTop: theme.spacing(3),
})

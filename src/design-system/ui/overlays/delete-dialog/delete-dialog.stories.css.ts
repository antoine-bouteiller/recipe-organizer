import { style, globalStyle } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const container = style({})

globalStyle(`.${container} > * + *`, {
  marginTop: theme.spacing(3),
})

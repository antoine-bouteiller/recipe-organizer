import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const image = style({
  height: theme.spacing(10),
  width: theme.spacing(10),
})

import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const image = style({
  height: theme.spacing(10),
  width: theme.spacing(10),
})

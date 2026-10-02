import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const container = style({
  height: theme.spacing(64),
  width: '100%',
})

export const section = style({
  padding: theme.spacing(4),
})

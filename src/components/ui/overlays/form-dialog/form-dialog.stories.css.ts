import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
})

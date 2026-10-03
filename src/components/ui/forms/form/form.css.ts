import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  width: '100%',
})

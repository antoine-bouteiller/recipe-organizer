import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const form = style({
  display: 'contents',
})

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
})

import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const variantList = style({
  display: 'grid',
  gap: theme.spacing(3),
})

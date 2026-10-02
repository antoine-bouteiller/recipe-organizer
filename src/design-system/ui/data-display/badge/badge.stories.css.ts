import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const variantOptions = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
})

export const sizeOptions = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(3),
})

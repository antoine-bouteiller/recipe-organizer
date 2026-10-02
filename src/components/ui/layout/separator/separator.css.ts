import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const separator = style({
  backgroundColor: theme.colors.border,
  flexShrink: 0,
  height: '1px',
  width: '100%',
})

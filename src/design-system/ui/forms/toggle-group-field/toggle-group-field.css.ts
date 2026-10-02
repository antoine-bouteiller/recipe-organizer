import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const wrapper = style({
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
})

export const group = style({
  vars: {
    '--toggle-hit-min-width': 'auto',
  },
  display: 'flex',
  gap: theme.spacing(0.5),
  width: 'fit-content',
})

export const item = style({
  flexShrink: 0,
})

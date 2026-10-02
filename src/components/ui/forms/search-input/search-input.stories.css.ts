import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const customPlaceholderField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const storyLayout = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

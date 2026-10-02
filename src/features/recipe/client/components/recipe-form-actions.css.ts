import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  justifyContent: 'flex-end',
  paddingTop: theme.spacing(6),
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
})

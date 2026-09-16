import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
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

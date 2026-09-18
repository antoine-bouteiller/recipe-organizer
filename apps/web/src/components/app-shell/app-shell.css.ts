import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const element = style({
  background: theme.colors.muted,
  display: 'none',
  position: 'sticky',
  top: theme.spacing(0),
  width: '100%',
  zIndex: 50,
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const container = style({
  height: theme.spacing(9),
  width: theme.spacing(56),
})

export const mainContent = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  minHeight: theme.spacing(0),
  '@media': {
    'screen and (min-width: 768px)': {
      paddingBottom: theme.spacing(0),
    },
  },
})

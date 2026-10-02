import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2),
  width: '100%',
})

export const ingredientRow = style({
  display: 'flex',
  gap: theme.spacing(2),
})

export const ingredientFields = style({
  alignItems: 'flex-start',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  width: '100%',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
})

export const mobileSeparator = style({
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

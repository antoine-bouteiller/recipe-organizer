import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const buttonGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
})

export const comparisonRow = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
})

export const searchRow = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(4),
  width: theme.spacing(60),
})

export const sizeOptions = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
})

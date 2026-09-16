import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  paddingTop: 'var(--spacing-2)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  display: 'flex',
  gap: 'var(--spacing-2)',
})

export const container3 = style({
  alignItems: 'flex-start',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  justifyContent: 'space-between',
  width: 'var(--sizes-full)',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
})

export const container4 = style({
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

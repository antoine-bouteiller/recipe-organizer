import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-4)',
  justifyContent: 'flex-end',
  paddingTop: 'var(--spacing-6)',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
})

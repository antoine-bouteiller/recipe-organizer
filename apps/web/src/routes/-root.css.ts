import { style } from '@vanilla-extract/css'

export const element = style({
  background: 'var(--colors-muted)',
  display: 'none',
  position: 'sticky',
  top: 'var(--spacing-0)',
  width: 'var(--sizes-full)',
  zIndex: 50,
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const container = style({
  height: 'var(--sizes-9)',
  width: 'var(--sizes-56)',
})

export const element2 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  minHeight: 'var(--sizes-0)',
  '@media': {
    'screen and (min-width: 768px)': {
      paddingBottom: 'var(--spacing-0)',
    },
  },
})

import { style } from '@vanilla-extract/css'

export const storySections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

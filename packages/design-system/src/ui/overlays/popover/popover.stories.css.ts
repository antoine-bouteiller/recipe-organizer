import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  width: 'var(--sizes-56)',
})

export const heading = style({
  fontWeight: 'var(--font-weights-medium)',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

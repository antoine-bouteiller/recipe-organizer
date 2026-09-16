import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-3)',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-3)',
})

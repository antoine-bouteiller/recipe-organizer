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
  gap: 'var(--spacing-4)',
})

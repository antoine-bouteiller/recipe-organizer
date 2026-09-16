import { style } from '@vanilla-extract/css'

export const formClassName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-4)',
  width: 'var(--sizes-full)',
})

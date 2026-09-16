import { style } from '@vanilla-extract/css'

export const container = style({
  width: 'var(--sizes-56)',
})

export const text = style({
  position: 'absolute',
  right: 'var(--spacing-1-5)',
  top: 'var(--spacing-1-5)',
})

export const text2 = style({
  aspectRatio: '1 / 1',
})

export const container2 = style({
  alignItems: 'center',
  color: 'var(--colors-foreground)',
  display: 'flex',
  gap: 'var(--spacing-2)',
})

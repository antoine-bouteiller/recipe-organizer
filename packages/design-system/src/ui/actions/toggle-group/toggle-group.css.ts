import { style } from '@vanilla-extract/css'

export const wrapperClassName = style({
  maxWidth: 'var(--sizes-full)',
  overflowX: 'auto',
  overflowY: 'hidden',
})

export const groupClassName = style({
  vars: {
    '--toggle-hit-min-width': 'auto',
  },
  display: 'flex',
  gap: 'var(--spacing-0-5)',
  width: 'fit-content',
})

export const itemClassName = style({
  flexShrink: 0,
})

import { style } from '@vanilla-extract/css'

export const subrecipeFields = style({
  display: 'grid',
  gap: 'var(--spacing-4)',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
})

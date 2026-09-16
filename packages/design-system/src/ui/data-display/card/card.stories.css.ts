import { style } from '@vanilla-extract/css'

export const container = style({
  fontSize: 'var(--font-sizes-sm)',
  padding: 'var(--spacing-6)',
  paddingTop: 'var(--spacing-0)',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const container3 = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-3)',
  justifyContent: 'flex-end',
  padding: 'var(--spacing-6)',
  paddingTop: 'var(--spacing-0)',
})

export const container4 = style({
  fontSize: 'var(--font-sizes-sm)',
  padding: 'var(--spacing-6)',
})

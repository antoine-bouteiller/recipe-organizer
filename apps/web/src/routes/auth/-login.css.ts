import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'grid',
  flex: '1 1 0%',
  padding: 'var(--spacing-4)',
  placeItems: 'center',
})

export const container2 = style({
  maxWidth: 'var(--sizes-sm)',
  width: 'var(--sizes-full)',
})

export const container3 = style({
  paddingBottom: 'var(--spacing-6)',
  paddingInline: 'var(--spacing-6)',
})

export const image = style({
  height: 'var(--sizes-4)',
})

export const container4 = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: 'var(--spacing-6)',
  paddingInline: 'var(--spacing-6)',
})

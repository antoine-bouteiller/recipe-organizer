import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  borderColor: 'var(--colors-border)',
  borderRadius: 'var(--radii-md)',
  borderWidth: '1px',
  height: 'var(--sizes-56)',
  padding: 'var(--spacing-4)',
  width: 'var(--sizes-80)',
})

export const container3 = style({
  display: 'grid',
  fontSize: 'var(--font-sizes-sm)',
  gap: 'var(--spacing-3)',
})

export const container4 = style({
  borderColor: 'var(--colors-border)',
  borderRadius: 'var(--radii-md)',
  borderWidth: '1px',
  height: 'var(--sizes-56)',
  padding: 'var(--spacing-4)',
  width: 'var(--sizes-80)',
})

export const container5 = style({
  display: 'grid',
  fontSize: 'var(--font-sizes-sm)',
  gap: 'var(--spacing-3)',
})

export const container6 = style({
  height: 'var(--sizes-56)',
  width: 'var(--sizes-80)',
})

export const container7 = style({
  display: 'grid',
  fontSize: 'var(--font-sizes-sm)',
  gap: 'var(--spacing-3)',
})

import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  width: 'var(--sizes-80)',
})

export const text = style({
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-medium)',
})

export const container3 = style({
  marginBlock: 'var(--spacing-3)',
})

export const text2 = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
})

export const container4 = style({
  alignItems: 'center',
  display: 'flex',
  fontSize: 'var(--font-sizes-sm)',
  gap: 'var(--spacing-3)',
  height: 'var(--sizes-8)',
})

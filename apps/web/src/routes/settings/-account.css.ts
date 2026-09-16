import { style } from '@vanilla-extract/css'

export const container = style({
  padding: 'var(--spacing-6)',
})

export const container2 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-6)',
})

export const heading = style({
  fontSize: 'var(--font-sizes-lg)',
  fontWeight: 'var(--font-weights-semibold)',
  marginBottom: 'var(--spacing-4)',
})

export const container3 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-3)',
})

export const text = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-medium)',
})

export const text2 = style({
  fontSize: 'var(--font-sizes-sm)',
  marginTop: 'var(--spacing-1)',
})

export const container4 = style({
  borderTopWidth: '1px',
  paddingTop: 'var(--spacing-6)',
})

export const heading2 = style({
  fontSize: 'var(--font-sizes-lg)',
  fontWeight: 'var(--font-weights-semibold)',
  marginBottom: 'var(--spacing-4)',
})

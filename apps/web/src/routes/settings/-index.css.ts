import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'block',
  marginBottom: 'var(--spacing-4)',
  width: 'var(--sizes-full)',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const container2 = style({
  display: 'grid',
  gap: 'var(--spacing-4)',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const container3 = style({
  cursor: 'pointer',
  height: 'var(--sizes-full)',
  padding: 'var(--spacing-4)',
})

export const container4 = style({
  alignItems: 'flex-start',
  display: 'flex',
  justifyContent: 'space-between',
})

export const container5 = style({
  alignItems: 'flex-start',
  display: 'flex',
  flex: '1 1 0%',
  gap: 'var(--spacing-3)',
})

export const container6 = style({
  background: 'color-mix(in srgb, var(--colors-primary) 10%, transparent)',
  borderRadius: 'var(--radii-lg)',
  color: 'var(--colors-primary)',
  padding: 'var(--spacing-2)',
})

export const container7 = style({
  flex: '1 1 0%',
})

export const heading = style({
  fontWeight: 'var(--font-weights-semibold)',
})

export const text = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-sm)',
  marginTop: 'var(--spacing-1)',
})

export const text2 = style({
  color: 'var(--colors-muted-foreground)',
  flexShrink: 0,
})

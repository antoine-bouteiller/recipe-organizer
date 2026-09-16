import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'grid',
  gap: 'var(--spacing-4)',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    'screen and (min-width: 640px)': {
      gap: 'var(--spacing-6)',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: 'var(--spacing-4)',
  justifyContent: 'center',
  padding: 'var(--spacing-8)',
  textAlign: 'center',
})

export const container3 = style({
  alignItems: 'center',
  background: 'var(--colors-accent)',
  borderRadius: 'var(--radii-full)',
  color: 'var(--colors-primary)',
  display: 'flex',
  height: 'var(--sizes-16)',
  justifyContent: 'center',
  width: 'var(--sizes-16)',
})

export const text = style({
  color: 'var(--colors-muted-foreground)',
  textWrap: 'balance',
})

export const container4 = style({
  display: 'grid',
  gap: 'var(--spacing-4)',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    'screen and (min-width: 640px)': {
      gap: 'var(--spacing-6)',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

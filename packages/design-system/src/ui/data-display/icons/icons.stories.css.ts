import { style } from '@vanilla-extract/css'

export const gallery = style({
  display: 'grid',
  gap: 'var(--spacing-4)',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  '@media': {
    'screen and (min-width: 640px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const iconCell = style({
  alignItems: 'center',
  borderRadius: 'var(--radii-md)',
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  padding: 'var(--spacing-4)',
})

export const iconName = style({
  fontSize: 'var(--font-sizes-xs)',
})

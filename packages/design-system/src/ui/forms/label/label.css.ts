import { style } from '@vanilla-extract/css'

export const labelClassName = style({
  alignItems: 'center',
  color: 'var(--colors-foreground)',
  display: 'inline-flex',
  fontSize: 'var(--font-sizes-base)',
  fontWeight: 'var(--font-weights-medium)',
  gap: 'var(--spacing-2)',
  lineHeight: '18px',
  '@media': {
    'screen and (min-width: 640px)': {
      fontSize: 'var(--font-sizes-sm)',
      lineHeight: '16px',
    },
  },
})

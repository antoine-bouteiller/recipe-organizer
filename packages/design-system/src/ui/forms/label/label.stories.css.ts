import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-8)',
  minWidth: 'var(--sizes-0)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  display: 'grid',
  gap: 'var(--spacing-2)',
  width: 'var(--sizes-80)',
})

export const element = style({
  backgroundColor: 'var(--colors-background)',
  border: '1px solid',
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-md)',
  fontSize: 'var(--font-sizes-sm)',
  height: 'var(--sizes-9)',
  paddingInline: 'var(--spacing-3)',
})

export const container3 = style({
  display: 'grid',
  gap: 'var(--spacing-2)',
  width: 'var(--sizes-80)',
})

export const element2 = style({
  backgroundColor: 'var(--colors-background)',
  border: '1px solid',
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-md)',
  fontSize: 'var(--font-sizes-sm)',
  height: 'var(--sizes-9)',
  paddingInline: 'var(--spacing-3)',
  selectors: {
    '&[data-disabled], &:disabled': {
      opacity: 0.64,
    },
  },
})

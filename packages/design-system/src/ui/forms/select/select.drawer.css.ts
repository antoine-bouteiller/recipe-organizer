import { style } from '@vanilla-extract/css'

export const listClassName = style({
  display: 'flex',
  flexDirection: 'column',
})

export const itemClassName = style({
  alignItems: 'center',
  borderRadius: 'var(--radii-sm)',
  display: 'flex',
  fontSize: 'var(--font-sizes-base)',
  gap: 'var(--spacing-2)',
  justifyContent: 'space-between',
  minHeight: 'var(--sizes-11)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: 'var(--spacing-2)',
  width: 'var(--sizes-full)',
  selectors: {
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'var(--colors-accent)',
          color: 'var(--colors-accent-foreground)',
        },
      },
    },
  },
})

export const labelClassName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const iconClassName = style({
  flexShrink: 0,
})

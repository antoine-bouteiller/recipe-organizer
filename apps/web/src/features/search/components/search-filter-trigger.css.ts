import { style } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(24px)',
  backdropFilter: 'blur(24px)',
  background: 'color-mix(in srgb, var(--colors-background) 72%, transparent)',
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-lg)',
  borderWidth: '1px',
  boxShadow: 'var(--shadows-xs)',
  color: 'var(--colors-foreground)',
  display: 'inline-flex',
  height: 'var(--sizes-10)',
  justifyContent: 'center',
  vars: {
    '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  },
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  width: 'var(--sizes-10)',
  selectors: {
    '.dark &': {
      background: 'color-mix(in srgb, var(--colors-input) 48%, transparent)',
    },
    '&:is(:focus-visible, [data-focus-visible])': {
      outlineColor: 'var(--colors-ring)',
      outlineOffset: '1px',
      outlineWidth: '2px',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          background: 'color-mix(in srgb, var(--colors-accent) 50%, transparent)',
        },
      },
    },
  },
})

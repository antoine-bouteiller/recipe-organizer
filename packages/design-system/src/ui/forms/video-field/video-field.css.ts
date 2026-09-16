import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-4)',
  justifyContent: 'space-between',
  paddingInline: 'var(--spacing-4)',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-3)',
})

export const container3 = style({
  alignItems: 'center',
  backgroundColor: 'var(--colors-background)',
  borderRadius: 'var(--radii-full)',
  borderWidth: '1px',
  display: 'flex',
  flexShrink: 0,
  height: 'var(--sizes-10)',
  justifyContent: 'center',
  width: 'var(--sizes-10)',
})

export const text = style({
  opacity: 0.6,
})

export const container4 = style({
  display: 'flex',
  flexDirection: 'column',
})

export const text2 = style({
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-medium)',
})

export const text3 = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-xs)',
})

export const element = style({
  alignItems: 'center',
  backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 10%, transparent)',
  borderRadius: 'var(--radii-full)',
  color: 'var(--colors-destructive)',
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  height: 'var(--sizes-8)',
  justifyContent: 'center',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    '--transition-easing': 'var(--easings-in-out)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: 'var(--easings-in-out)',
  width: 'var(--sizes-8)',
  selectors: {
    '&:is(:focus-visible, [data-focus-visible])': {
      borderColor: 'var(--colors-ring)',
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-ring) 50%, transparent)',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 20%, transparent)',
        },
      },
    },
  },
})

export const container5 = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingBlock: 'var(--spacing-3)',
  paddingInline: 'var(--spacing-4)',
  textAlign: 'center',
})

export const container6 = style({
  alignItems: 'center',
  backgroundColor: 'var(--colors-background)',
  borderRadius: 'var(--radii-full)',
  borderWidth: '1px',
  display: 'flex',
  flexShrink: 0,
  height: 'var(--sizes-11)',
  justifyContent: 'center',
  marginBottom: 'var(--spacing-2)',
  width: 'var(--sizes-11)',
})

export const text4 = style({
  opacity: 0.6,
})

export const text5 = style({
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-medium)',
  marginBottom: 'var(--spacing-1-5)',
})

export const text6 = style({
  color: 'var(--colors-muted-foreground)',
  fontSize: 'var(--font-sizes-xs)',
  marginBottom: 'var(--spacing-2)',
})

export const container7 = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const element2 = style({
  display: 'none',
})

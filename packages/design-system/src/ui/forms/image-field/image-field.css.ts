import { style } from '@vanilla-extract/css'

export const container = style({
  inset: 'var(--spacing-0)',
  position: 'absolute',
})

export const image = style({
  height: 'var(--sizes-full)',
  objectFit: 'cover',
  width: 'var(--sizes-full)',
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingBlock: 'var(--spacing-3)',
  paddingInline: 'var(--spacing-4)',
  textAlign: 'center',
})

export const container3 = style({
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

export const text = style({
  opacity: 0.6,
})

export const text2 = style({
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-medium)',
  marginBottom: 'var(--spacing-1-5)',
})

export const container4 = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const container5 = style({
  position: 'absolute',
  right: 'var(--spacing-4)',
  top: 'var(--spacing-4)',
})

export const element = style({
  alignItems: 'center',
  backgroundColor: 'color-mix(in srgb, var(--colors-black) 60%, transparent)',
  borderRadius: 'var(--radii-full)',
  color: 'var(--colors-white)',
  cursor: 'pointer',
  display: 'flex',
  height: 'var(--sizes-8)',
  justifyContent: 'center',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, box-shadow',
    '--transition-easing': 'var(--easings-in-out)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, box-shadow',
  transitionTimingFunction: 'var(--easings-in-out)',
  width: 'var(--sizes-8)',
  zIndex: 50,
  selectors: {
    '&:is(:focus-visible, [data-focus-visible])': {
      borderColor: 'var(--colors-ring)',
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-ring) 50%, transparent)',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'color-mix(in srgb, var(--colors-black) 80%, transparent)',
        },
      },
    },
  },
})

export const element2 = style({
  display: 'none',
})

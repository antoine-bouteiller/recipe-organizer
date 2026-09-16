import { style, globalStyle } from '@vanilla-extract/css'

export const rootClassName = style({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-2)',
  width: 'var(--sizes-full)',
})

export const groupClassName = style({
  selectors: {
    '&:focus-within': {
      borderColor: 'var(--colors-ring)',
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-ring) 24%, transparent)',
    },
    '&:focus-within:has([aria-invalid])': {
      borderColor: 'color-mix(in srgb, var(--colors-destructive) 64%, transparent)',
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-destructive) 48%, transparent)',
    },
    '&:has([aria-invalid])': {
      borderColor: 'color-mix(in srgb, var(--colors-destructive) 36%, transparent)',
    },
    '&:has(input:-webkit-autofill)': {
      backgroundColor: 'color-mix(in srgb, var(--colors-foreground) 4%, transparent)',
    },
    '&:not([data-disabled], :focus-within, [aria-invalid])::before': {
      boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
    },
    '&[data-disabled]': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '.dark &:focus-within:has([aria-invalid])': {
      boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-destructive) 24%, transparent)',
    },
    '.dark &:has(input:-webkit-autofill)': {
      backgroundColor: 'color-mix(in srgb, var(--colors-foreground) 8%, transparent)',
    },
    '.dark &:not([data-disabled], :focus-within, [aria-invalid])::before': {
      boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
    },
    '.dark &': {
      backgroundColor: 'color-mix(in srgb, var(--colors-input) 32%, transparent)',
    },
    '&::before': {
      borderRadius: 'calc(var(--radii-lg) - 1px)',
      content: '""',
      inset: 'var(--spacing-0)',
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  vars: {
    '--owner-icon-size': '18px',
    '--transition-duration': '150ms',
    '--transition-prop': 'box-shadow',
    '--transition-easing': 'var(--easings-in-out)',
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: 'var(--colors-background)',
  borderColor: 'var(--colors-input)',
  borderRadius: 'var(--radii-lg)',
  borderWidth: '1px',
  color: 'var(--colors-foreground)',
  display: 'flex',
  fontSize: 'var(--font-sizes-base)',
  justifyContent: 'space-between',
  position: 'relative',
  outlineColor: 'color-mix(in srgb, var(--colors-ring) 24%, transparent)',
  transitionDuration: '150ms',
  transitionProperty: 'box-shadow',
  transitionTimingFunction: 'var(--easings-in-out)',
  width: 'var(--sizes-full)',
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: 'var(--font-sizes-sm)',
    },
  },
})

export const decrementClassName = style({
  alignItems: 'center',
  borderEndStartRadius: 'calc(var(--radii-lg) - 1px)',
  borderStartStartRadius: 'calc(var(--radii-lg) - 1px)',
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  paddingInline: 'calc(var(--spacing-3) - 1px)',
  position: 'relative',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'background-color',
    '--transition-easing': 'var(--easings-in-out)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'background-color',
  transitionTimingFunction: 'var(--easings-in-out)',
  selectors: {
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          content: '""',
          inset: 'var(--spacing-0)',
          minHeight: 'var(--sizes-11)',
          minWidth: 'var(--sizes-11)',
          position: 'absolute',
        },
      },
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'var(--colors-accent)',
        },
      },
    },
  },
})

export const incrementClassName = style({
  alignItems: 'center',
  borderEndEndRadius: 'calc(var(--radii-lg) - 1px)',
  borderStartEndRadius: 'calc(var(--radii-lg) - 1px)',
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  paddingInline: 'calc(var(--spacing-3) - 1px)',
  position: 'relative',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'background-color',
    '--transition-easing': 'var(--easings-in-out)',
  },
  transitionDuration: '150ms',
  transitionProperty: 'background-color',
  transitionTimingFunction: 'var(--easings-in-out)',
  selectors: {
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          content: '""',
          inset: 'var(--spacing-0)',
          minHeight: 'var(--sizes-11)',
          minWidth: 'var(--sizes-11)',
          position: 'absolute',
        },
      },
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: 'var(--colors-accent)',
        },
      },
    },
  },
})

export const inputClassName = style({
  backgroundColor: 'transparent',
  flexGrow: 1,
  fontVariantNumeric: 'tabular-nums',
  height: 'var(--sizes-8-5)',
  lineHeight: '34px',
  minWidth: 'var(--sizes-0)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: 'calc(var(--spacing-3) - 1px)',
  textAlign: 'center',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: 'var(--sizes-full)',
  '@media': {
    'screen and (min-width: 640px)': {
      height: 'var(--sizes-7-5)',
      lineHeight: '30px',
    },
  },
})

export const scrubAreaClassName = style({
  cursor: 'ew-resize',
  display: 'flex',
})

export const cursorClassName = style({
  filter: 'drop-shadow(0 1px 1px #0008)',
})

globalStyle(`.${groupClassName} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

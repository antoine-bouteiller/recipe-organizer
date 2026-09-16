import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const rootClassName = style({
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
})

export const groupClassName = style({
  selectors: {
    '&:focus-within': {
      borderColor: theme.colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${theme.colors.ring} 24%, transparent)`,
    },
    '&:focus-within:has([aria-invalid])': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 64%, transparent)`,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${theme.colors.destructive} 48%, transparent)`,
    },
    '&:has([aria-invalid])': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 36%, transparent)`,
    },
    '&:has(input:-webkit-autofill)': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 4%, transparent)`,
    },
    '&:not([data-disabled], :focus-within, [aria-invalid])::before': {
      boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
    },
    '&[data-disabled]': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '.dark &:focus-within:has([aria-invalid])': {
      boxShadow: `0 0 0 3px color-mix(in oklab, ${theme.colors.destructive} 24%, transparent)`,
    },
    '.dark &:has(input:-webkit-autofill)': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 8%, transparent)`,
    },
    '.dark &:not([data-disabled], :focus-within, [aria-invalid])::before': {
      boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
    },
    '.dark &': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.input} 32%, transparent)`,
    },
    '&::before': {
      borderRadius: `calc(${theme.radii.lg} - 1px)`,
      content: '""',
      inset: theme.spacing(0),
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  vars: {
    '--owner-icon-size': '18px',
    '--transition-duration': '150ms',
    '--transition-prop': 'box-shadow',
    '--transition-easing': theme.easings['in-out'],
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.input,
  borderRadius: theme.radii.lg,
  borderWidth: '1px',
  color: theme.colors.foreground,
  display: 'flex',
  fontSize: theme.fontSizes.base,
  justifyContent: 'space-between',
  position: 'relative',
  outlineColor: `color-mix(in srgb, ${theme.colors.ring} 24%, transparent)`,
  transitionDuration: '150ms',
  transitionProperty: 'box-shadow',
  transitionTimingFunction: theme.easings['in-out'],
  width: '100%',
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: theme.fontSizes.sm,
    },
  },
})

export const decrementClassName = style({
  alignItems: 'center',
  borderEndStartRadius: `calc(${theme.radii.lg} - 1px)`,
  borderStartStartRadius: `calc(${theme.radii.lg} - 1px)`,
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  paddingInline: `calc(${theme.spacing(3)} - 1px)`,
  position: 'relative',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'background-color',
    '--transition-easing': theme.easings['in-out'],
  },
  transitionDuration: '150ms',
  transitionProperty: 'background-color',
  transitionTimingFunction: theme.easings['in-out'],
  selectors: {
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          content: '""',
          inset: theme.spacing(0),
          minHeight: theme.spacing(11),
          minWidth: theme.spacing(11),
          position: 'absolute',
        },
      },
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: theme.colors.accent,
        },
      },
    },
  },
})

export const incrementClassName = style({
  alignItems: 'center',
  borderEndEndRadius: `calc(${theme.radii.lg} - 1px)`,
  borderStartEndRadius: `calc(${theme.radii.lg} - 1px)`,
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  paddingInline: `calc(${theme.spacing(3)} - 1px)`,
  position: 'relative',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'background-color',
    '--transition-easing': theme.easings['in-out'],
  },
  transitionDuration: '150ms',
  transitionProperty: 'background-color',
  transitionTimingFunction: theme.easings['in-out'],
  selectors: {
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          content: '""',
          inset: theme.spacing(0),
          minHeight: theme.spacing(11),
          minWidth: theme.spacing(11),
          position: 'absolute',
        },
      },
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: theme.colors.accent,
        },
      },
    },
  },
})

export const inputClassName = style({
  backgroundColor: 'transparent',
  flexGrow: 1,
  fontVariantNumeric: 'tabular-nums',
  height: theme.spacing(8.5),
  lineHeight: '34px',
  minWidth: theme.spacing(0),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: `calc(${theme.spacing(3)} - 1px)`,
  textAlign: 'center',
  transition: 'background-color 5000000s ease-in-out 0s',
  width: '100%',
  '@media': {
    'screen and (min-width: 640px)': {
      height: theme.spacing(7.5),
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

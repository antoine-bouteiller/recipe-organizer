import { style, globalStyle } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const group = style({
  selectors: {
    '&:focus-within': {
      borderColor: theme.colors.ring,
      boxShadow: theme.shadows.ring,
    },
    '&:focus-within:has([aria-invalid])': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 64%, transparent)`,
      boxShadow: theme.shadows.invalid,
    },
    '&:has([aria-invalid])': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 36%, transparent)`,
    },
    '&:has(input:-webkit-autofill)': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 4%, transparent)`,
    },
    '&:not([data-disabled], :focus-within, [aria-invalid])::before': {
      boxShadow: theme.shadows.edge,
    },
    '&[data-disabled]': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '.dark &:focus-within:has([aria-invalid])': {
      boxShadow: theme.shadows.invalid,
    },
    '.dark &:has(input:-webkit-autofill)': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 8%, transparent)`,
    },
    '.dark &': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.input} 32%, transparent)`,
    },
    '&::before': {
      borderRadius: theme.radius.lg,
      content: '""',
      inset: theme.spacing(0),
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  vars: {
    '--owner-icon-size': '18px',
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.input,
  borderRadius: theme.radius.lg,
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

export const input = style({
  backgroundColor: 'transparent',
  flexGrow: 1,
  fontVariantNumeric: 'tabular-nums',
  height: theme.spacing(8.5),
  lineHeight: '34px',
  minWidth: theme.spacing(0),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: theme.spacing(2.75),
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

globalStyle(`.${group} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

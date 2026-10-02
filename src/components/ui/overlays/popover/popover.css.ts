import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const positioner = style({
  position: 'fixed',
  translate: '-50% 0',
  zIndex: 50,
})

export const popup = style({
  selectors: {
    '&:has([data-slot=calendar])': {
      borderRadius: theme.radius.xl,
    },
    '&[data-ending-style], &[data-starting-style]': {
      opacity: 0,
      scale: '0.98',
    },
    '&:has([data-slot=calendar])::before': {
      borderRadius: theme.radius.xl,
    },
    '&::before': {
      borderRadius: theme.radius.lg,
      boxShadow: theme.shadows.edge,
      content: '""',
      inset: theme.spacing(0),
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  backgroundColor: theme.colors.popover,
  borderRadius: theme.radius.lg,
  borderWidth: '1px',
  boxShadow: theme.shadows.overlay,
  color: theme.colors['popover-foreground'],
  display: 'flex',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  position: 'relative',
  transformOrigin: 'top',
  transitionDuration: '150ms',
  transitionProperty: 'scale, opacity',
  transitionTimingFunction: theme.easings['in-out'],
})

export const viewport = style({
  selectors: {
    '&:has([data-slot=calendar])': {
      padding: theme.spacing(2),
    },
  },
  borderRadius: theme.radius.inherit,
  maxHeight: 'var(--available-height)',
  overflowY: 'auto',
  padding: theme.spacing(2),
  position: 'relative',
})

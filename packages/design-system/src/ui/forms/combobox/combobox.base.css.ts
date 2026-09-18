import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const inputGroup = style({
  selectors: {
    '&:has(:disabled)': {
      opacity: 0.64,
    },
  },
  color: theme.colors.foreground,
  position: 'relative',
  width: '100%',
})

export const input = style({
  selectors: {
    '&:disabled': {
      opacity: 1,
    },
    '&:has(+ [data-slot="combobox-trigger"], + [data-slot="combobox-clear"])': {
      paddingInlineEnd: theme.spacing(7),
    },
  },
  backgroundColor: 'transparent',
  height: theme.spacing(8.5),
  lineHeight: '34px',
  minWidth: theme.spacing(0),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: theme.spacing(2.75),
  transition: 'background-color 5000000s ease-in-out 0s',
  width: '100%',
  '@media': {
    'screen and (min-width: 640px)': {
      height: theme.spacing(7.5),
      lineHeight: '30px',
    },
  },
})

export const action = style({
  selectors: {
    '&:has(+ [data-slot="combobox-clear"])': {
      display: 'none',
    },
    '&::after': {
      '@media': {
        '(pointer: coarse)': {
          content: '""',
          minHeight: theme.spacing(11),
          minWidth: theme.spacing(11),
          position: 'absolute',
        },
      },
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          opacity: 1,
        },
      },
    },
  },
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: theme.radius.md,
  borderWidth: '1px',
  cursor: 'pointer',
  display: 'inline-flex',
  height: theme.spacing(8),
  justifyContent: 'center',
  opacity: 0.8,
  outline: '2px solid transparent',
  outlineOffset: '2px',
  position: 'absolute',
  right: '.5',
  top: '50%',
  transform: 'translateY(-50%)',
  transitionDuration: '150ms',
  transitionProperty: 'opacity',
  transitionTimingFunction: theme.easings['in-out'],
  width: theme.spacing(8),
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      height: theme.spacing(7),
      width: theme.spacing(7),
    },
  },
})

export const positioner = style({
  WebkitUserSelect: 'none',
  userSelect: 'none',
  zIndex: 50,
})

export const frame = style({
  selectors: {
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
  display: 'flex',
  maxHeight: '100%',
  maxWidth: 'var(--available-width)',
  minWidth: 'var(--anchor-width)',
  position: 'relative',
  transformOrigin: 'var(--transform-origin)',
  transitionDuration: '150ms',
  transitionProperty: 'scale, opacity',
  transitionTimingFunction: theme.easings['in-out'],
})

export const popup = style({
  color: theme.colors.foreground,
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  maxHeight: 'min(var(--available-height), 368px)',
})

export const item = style({
  selectors: {
    '&[data-disabled]': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '&[data-highlighted]': {
      backgroundColor: theme.colors.accent,
      color: theme.colors['accent-foreground'],
    },
  },
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  borderRadius: theme.radius.sm,
  cursor: 'default',
  display: 'grid',
  fontSize: theme.fontSizes.base,
  gap: theme.spacing(2),
  gridTemplateColumns: '16px 1fr',
  minHeight: theme.spacing(8),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingBlock: theme.spacing(1),
  paddingInlineEnd: theme.spacing(4),
  paddingInlineStart: theme.spacing(2),
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: theme.fontSizes.sm,
      minHeight: theme.spacing(7),
    },
  },
})

export const separator = style({
  selectors: {
    '&:last-child': {
      display: 'none',
    },
  },
  backgroundColor: theme.colors.border,
  height: theme.spacing(0.25),
  marginBlock: theme.spacing(1),
  marginInline: theme.spacing(2),
})

export const empty = style({
  selectors: {
    '&:not(:empty)': {
      padding: theme.spacing(2),
    },
  },
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.base,
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 640px)': {
      fontSize: theme.fontSizes.sm,
    },
  },
})

export const list = style({
  selectors: {
    '&:not(:empty)': {
      padding: theme.spacing(1),
    },
    '&[data-has-overflow-y]': {
      paddingInlineEnd: theme.spacing(3),
    },
  },
  scrollPaddingBlock: theme.spacing(1),
})

export const add = style({
  padding: theme.spacing(1),
})

globalStyle(`.${action} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

globalStyle(`.${item} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

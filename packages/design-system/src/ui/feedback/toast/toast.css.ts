import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const viewport = recipe({
  base: {
    vars: {
      '--toast-inset': theme.spacing(4),
    },
    bottom: 'var(--toast-inset)',
    display: 'flex',
    marginInline: 'auto',
    maxWidth: theme.spacing(90),
    position: 'fixed',
    right: 'var(--toast-inset)',
    width: 'calc(100% - var(--toast-inset) * 2)',
    zIndex: 60,
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--toast-inset': theme.spacing(8),
        },
      },
    },
  },
})

export const root = recipe({
  base: {
    selectors: {
      '&[data-ending-style]': {
        opacity: 0,
      },
      '&[data-ending-style]:not([data-limited]):not([data-swipe-direction])': {
        transform: 'translateY(calc(100% + var(--toast-inset)))',
      },
      '&[data-ending-style][data-swipe-direction=down]': {
        transform: 'translateY(calc(var(--toast-swipe-movement-y) + 100% + var(--toast-inset)))',
      },
      '&[data-ending-style][data-swipe-direction=right]': {
        transform: 'translateX(calc(var(--toast-swipe-movement-x) + 100% + var(--toast-inset))) translateY(var(--toast-calc-offset-y))',
      },
      '&[data-expanded]': {
        backgroundColor: theme.colors.popover,
        height: 'var(--toast-height)',
        transform: 'translateX(var(--toast-swipe-movement-x)) translateY(var(--toast-calc-offset-y))',
      },
      '&[data-limited]': {
        opacity: 0,
      },
      '&[data-starting-style]': {
        transform: 'translateY(calc(100% + var(--toast-inset)))',
      },
      '.dark &[data-expanded]': {
        backgroundColor: theme.colors.popover,
      },
      '.dark &': {
        backgroundClip: 'border-box',
        WebkitBackgroundClip: 'border-box',
        backgroundColor: `color-mix(in srgb, ${theme.colors.popover}, black calc(6% * max(0, var(--toast-index, 0))))`,
      },
      '&::before': {
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadows.edge,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
      '&::after': {
        bottom: '100%',
        content: '""',
        height: 'calc(var(--toast-gap) + 1px)',
        left: theme.spacing(0),
        position: 'absolute',
        width: '100%',
      },
    },
    vars: {
      '--toast-calc-height': 'var(--toast-frontmost-height, var(--toast-height))',
      '--toast-calc-offset-y': 'calc(var(--toast-offset-y) * -1 + var(--toast-index) * var(--toast-gap) * -1 + var(--toast-swipe-movement-y))',
      '--toast-gap': theme.spacing(3),
      '--toast-peek': theme.spacing(3),
      '--toast-scale': 'calc(max(0, 1 - (var(--toast-index) * .1)))',
      '--toast-shrink': 'calc(1 - var(--toast-scale))',
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: `color-mix(in srgb, ${theme.colors.popover}, black calc(1% * max(0, var(--toast-index, 0))))`,
    borderRadius: theme.radius.lg,
    borderWidth: '1px',
    bottom: theme.spacing(0),
    boxShadow: theme.shadows.overlay,
    color: theme.colors['popover-foreground'],
    height: 'var(--toast-calc-height)',
    position: 'absolute',
    right: theme.spacing(0),
    transform:
      'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - (var(--toast-index) * var(--toast-peek)) - (var(--toast-shrink) * var(--toast-calc-height)))) scale(var(--toast-scale))',
    transformOrigin: 'bottom',
    transition: 'transform .5s cubic-bezier(.22,1,.36,1), opacity .5s, height .15s, background-color .5s',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    width: '100%',
    zIndex: 'calc(9999 - var(--toast-index))',
  },
})

export const content = recipe({
  base: {
    selectors: {
      '&[data-behind]': {
        opacity: 0,
      },
      '&[data-behind]:not([data-expanded])': {
        pointerEvents: 'none',
      },
      '&[data-expanded]': {
        opacity: 1,
      },
    },
    alignItems: 'center',
    display: 'flex',
    fontSize: theme.fontSizes.sm,
    gap: theme.spacing(1.5),
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingInline: theme.spacing(3.5),
    paddingBlock: theme.spacing(3),
    pointerEvents: 'auto',
    transition: 'opacity 250ms',
  },
})

export const icon = recipe({
  base: {
    display: 'flex',
    flexShrink: 0,
    gap: theme.spacing(2),
  },
})

export const text = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
})

export const container = style({
  vars: {
    '--owner-icon-size': '16px',
  },
  alignItems: 'center',
  display: 'flex',
  height: '1lh',
})

globalStyle(`.${root.classNames.base}[data-type=error] [data-slot=toast-icon]`, {
  color: theme.colors.destructive,
})

globalStyle(`.${root.classNames.base}[data-type=success] [data-slot=toast-icon]`, {
  color: theme.colors.success,
})

globalStyle(`.${text.classNames.base} [data-slot=toast-description]`, {
  color: theme.colors['muted-foreground'],
})

globalStyle(`.${text.classNames.base} [data-slot=toast-title]`, {
  fontWeight: theme.fontWeights.medium,
})

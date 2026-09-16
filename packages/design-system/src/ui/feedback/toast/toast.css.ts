import { style, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const viewportRecipe = recipe({
  base: {
    vars: {
      '--toast-inset': 'var(--spacing-4)',
    },
    bottom: 'var(--toast-inset)',
    display: 'flex',
    marginInline: 'auto',
    maxWidth: 'var(--sizes-90)',
    position: 'fixed',
    right: 'var(--toast-inset)',
    width: 'calc(100% - var(--toast-inset) * 2)',
    zIndex: 60,
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--toast-inset': 'var(--spacing-8)',
        },
      },
    },
  },
})

export const rootRecipe = recipe({
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
        backgroundColor: 'var(--colors-popover)',
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
        backgroundColor: 'var(--colors-popover)',
      },
      '.dark &': {
        backgroundClip: 'border-box',
        WebkitBackgroundClip: 'border-box',
        backgroundColor: 'color-mix(in srgb, var(--colors-popover), black calc(6% * max(0, var(--toast-index, 0))))',
      },
      '&::before': {
        borderRadius: 'calc(var(--radii-lg) - 1px)',
        boxShadow: '0 1px rgb(0 0 0 / 4%)',
        content: '""',
        inset: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
      },
      '.dark &::before': {
        boxShadow: '0 -1px rgb(255 255 255 / 6%)',
      },
      '&::after': {
        bottom: '100%',
        content: '""',
        height: 'calc(var(--toast-gap) + 1px)',
        left: 'var(--spacing-0)',
        position: 'absolute',
        width: 'var(--sizes-full)',
      },
    },
    vars: {
      '--toast-calc-height': 'var(--toast-frontmost-height, var(--toast-height))',
      '--toast-calc-offset-y': 'calc(var(--toast-offset-y) * -1 + var(--toast-index) * var(--toast-gap) * -1 + var(--toast-swipe-movement-y))',
      '--toast-gap': 'var(--spacing-3)',
      '--toast-peek': 'var(--spacing-3)',
      '--toast-scale': 'calc(max(0, 1 - (var(--toast-index) * .1)))',
      '--toast-shrink': 'calc(1 - var(--toast-scale))',
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: 'color-mix(in srgb, var(--colors-popover), black calc(1% * max(0, var(--toast-index, 0))))',
    borderRadius: 'var(--radii-lg)',
    borderWidth: '1px',
    bottom: 'var(--spacing-0)',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 5%), 0 4px 6px -4px rgb(0 0 0 / 5%)',
    color: 'var(--colors-popover-foreground)',
    height: 'var(--toast-calc-height)',
    position: 'absolute',
    right: 'var(--spacing-0)',
    transform:
      'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - (var(--toast-index) * var(--toast-peek)) - (var(--toast-shrink) * var(--toast-calc-height)))) scale(var(--toast-scale))',
    transformOrigin: 'bottom',
    transition: 'transform .5s cubic-bezier(.22,1,.36,1), opacity .5s, height .15s, background-color .5s',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    width: 'var(--sizes-full)',
    zIndex: 'calc(9999 - var(--toast-index))',
  },
})

export const contentRecipe = recipe({
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
    fontSize: 'var(--font-sizes-sm)',
    gap: 'var(--spacing-1-5)',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingInline: 'var(--spacing-3-5)',
    paddingBlock: 'var(--spacing-3)',
    pointerEvents: 'auto',
    transition: 'opacity 250ms',
  },
})

export const iconRecipe = recipe({
  base: {
    display: 'flex',
    flexShrink: 0,
    gap: 'var(--spacing-2)',
  },
})

export const textRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-0-5)',
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

globalStyle(`.${rootRecipe.classNames.base}[data-type=error] [data-slot=toast-icon]`, {
  color: 'var(--colors-destructive)',
})

globalStyle(`.${rootRecipe.classNames.base}[data-type=success] [data-slot=toast-icon]`, {
  color: 'var(--colors-success)',
})

globalStyle(`.${textRecipe.classNames.base} [data-slot=toast-description]`, {
  color: 'var(--colors-muted-foreground)',
})

globalStyle(`.${textRecipe.classNames.base} [data-slot=toast-title]`, {
  fontWeight: 'var(--font-weights-medium)',
})

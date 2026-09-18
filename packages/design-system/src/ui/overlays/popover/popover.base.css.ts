import { theme } from '@recipe-organizer/design-system/theme'
import { fallbackVar, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const positioner = recipe({
  base: {
    selectors: {
      '&[data-instant]': {
        transition: 'none',
      },
    },
    height: 'var(--positioner-height)',
    maxWidth: 'var(--available-width)',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'top, left, right, bottom, transform',
    transitionTimingFunction: theme.easings['in-out'],
    width: 'var(--positioner-width)',
    zIndex: 50,
  },
})

export const popup = recipe({
  base: {
    selectors: {
      '&:has([data-slot=calendar])': {
        borderRadius: theme.radius.xl,
      },
      '&[data-starting-style]': {
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
    height: 'var(--popup-height, auto)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    transformOrigin: 'var(--transform-origin)',
    transitionDuration: '150ms',
    transitionProperty: 'width, height, scale, opacity',
    transitionTimingFunction: theme.easings['in-out'],
    width: 'var(--popup-width, auto)',
  },
})

export const viewport = recipe({
  base: {
    selectors: {
      '&:has([data-slot=calendar])': {
        padding: theme.spacing(2),
      },
      '&:not([data-transitioning])': {
        overflowY: 'auto',
      },
      '&[data-instant]': {
        transition: 'none',
      },
    },
    borderRadius: theme.radius.inherit,
    height: '100%',
    maxHeight: 'var(--available-height)',
    overflow: 'clip',
    paddingBlock: theme.spacing(4),
    paddingInline: fallbackVar('var(--viewport-inline-padding)', theme.spacing(4)),
    position: 'relative',
  },
})

globalStyle(`.${viewport.classNames.base} :is([data-current], [data-previous])`, {
  opacity: 1,
  transition: `opacity 150ms ${theme.easings['in-out']}`,
  width: `calc(var(--popup-width) - 2 * ${fallbackVar('var(--viewport-inline-padding)', theme.spacing(4))} - 2px)`,
})

globalStyle(`.${viewport.classNames.base} :is([data-current], [data-previous]):is([data-ending-style], [data-starting-style])`, {
  opacity: 0,
})

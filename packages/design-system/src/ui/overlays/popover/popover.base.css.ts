import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle } from '@vanilla-extract/css'
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
    vars: {
      '--transition-duration': '150ms',
      '--transition-prop': 'top, left, right, bottom, transform',
      '--transition-easing': theme.easings['in-out'],
    },
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
        borderRadius: theme.radii.xl,
      },
      '&[data-starting-style]': {
        opacity: 0,
        scale: '0.98',
      },
      '&:has([data-slot=calendar])::before': {
        borderRadius: `calc(${theme.radii.xl} - 1px)`,
      },
      '&::before': {
        borderRadius: `calc(${theme.radii.lg} - 1px)`,
        boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
      '.dark &::before': {
        boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radii.lg,
    borderWidth: '1px',
    boxShadow: theme.shadows.overlay,
    color: theme.colors['popover-foreground'],
    display: 'flex',
    height: 'var(--popup-height, auto)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    transformOrigin: 'var(--transform-origin)',
    vars: {
      '--transition-duration': '150ms',
      '--transition-prop': 'width, height, scale, opacity',
      '--transition-easing': theme.easings['in-out'],
    },
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
    vars: {
      '--viewport-inline-padding': theme.spacing(4),
    },
    borderRadius: 'inherit',
    height: '100%',
    maxHeight: 'var(--available-height)',
    overflow: 'clip',
    paddingBlock: theme.spacing(4),
    paddingInline: 'var(--viewport-inline-padding)',
    position: 'relative',
  },
})

globalStyle(`.${viewport.classNames.base} :is([data-current], [data-previous])`, {
  opacity: 1,
  transition: `opacity 150ms ${theme.easings['in-out']}`,
  width: 'calc(var(--popup-width) - 2 * var(--viewport-inline-padding) - 2px)',
})

globalStyle(`.${viewport.classNames.base} :is([data-current], [data-previous]):is([data-ending-style], [data-starting-style])`, {
  opacity: 0,
})

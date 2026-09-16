import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const positionerClassName = recipe({
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
      '--transition-easing': 'var(--easings-in-out)',
    },
    transitionDuration: '150ms',
    transitionProperty: 'top, left, right, bottom, transform',
    transitionTimingFunction: 'var(--easings-in-out)',
    width: 'var(--positioner-width)',
    zIndex: 50,
  },
})

export const popupClassName = recipe({
  base: {
    selectors: {
      '&:has([data-slot=calendar])': {
        borderRadius: 'var(--radii-xl)',
      },
      '&[data-starting-style]': {
        opacity: 0,
        scale: '0.98',
      },
      '&:has([data-slot=calendar])::before': {
        borderRadius: 'calc(var(--radii-xl) - 1px)',
      },
      '&::before': {
        borderRadius: 'calc(var(--radii-lg) - 1px)',
        boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
        content: '""',
        inset: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
      },
      '.dark &::before': {
        boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: 'var(--colors-popover)',
    borderRadius: 'var(--radii-lg)',
    borderWidth: '1px',
    boxShadow: 'var(--shadows-overlay)',
    color: 'var(--colors-popover-foreground)',
    display: 'flex',
    height: 'var(--popup-height, auto)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    transformOrigin: 'var(--transform-origin)',
    vars: {
      '--transition-duration': '150ms',
      '--transition-prop': 'width, height, scale, opacity',
      '--transition-easing': 'var(--easings-in-out)',
    },
    transitionDuration: '150ms',
    transitionProperty: 'width, height, scale, opacity',
    transitionTimingFunction: 'var(--easings-in-out)',
    width: 'var(--popup-width, auto)',
  },
})

export const viewportClassName = recipe({
  base: {
    selectors: {
      '&:has([data-slot=calendar])': {
        padding: 'var(--spacing-2)',
      },
      '&:not([data-transitioning])': {
        overflowY: 'auto',
      },
      '&[data-instant]': {
        transition: 'none',
      },
    },
    vars: {
      '--viewport-inline-padding': 'var(--spacing-4)',
    },
    borderRadius: 'inherit',
    height: 'var(--sizes-full)',
    maxHeight: 'var(--available-height)',
    overflow: 'clip',
    paddingBlock: 'var(--spacing-4)',
    paddingInline: 'var(--viewport-inline-padding)',
    position: 'relative',
  },
})

globalStyle(`.${viewportClassName.classNames.base} :is([data-current], [data-previous])`, {
  opacity: 1,
  transition: 'opacity 150ms var(--easings-in-out)',
  width: 'calc(var(--popup-width) - 2 * var(--viewport-inline-padding) - 2px)',
})

globalStyle(`.${viewportClassName.classNames.base} :is([data-current], [data-previous]):is([data-ending-style], [data-starting-style])`, {
  opacity: 0,
})

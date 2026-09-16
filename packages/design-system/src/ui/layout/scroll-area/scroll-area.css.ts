import { recipe } from '@vanilla-extract/recipes'

export const rootRecipe = recipe({
  base: {
    height: 'var(--sizes-full)',
    minHeight: 'var(--sizes-0)',
    width: 'var(--sizes-full)',
  },
})

export const viewportRecipe = recipe({
  base: {
    selectors: {
      '&[data-has-overflow-x]': {
        overscrollBehaviorX: 'contain',
      },
      '&[data-has-overflow-y]': {
        overscrollBehaviorY: 'contain',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: '2px solid var(--colors-ring)',
        outlineOffset: '1px',
      },
    },
    borderRadius: 'inherit',
    height: 'var(--sizes-full)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    vars: {
      '--transition-duration': '150ms',
      '--transition-prop': 'box-shadow',
      '--transition-easing': 'var(--easings-in-out)',
    },
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'var(--easings-in-out)',
  },
  defaultVariants: {
    scrollFade: false,
    scrollbarGutter: false,
  },
  variants: {
    scrollFade: {
      true: {
        vars: {
          '--fade-size': '24px',
        },
        maskImage:
          'linear-gradient(to bottom, transparent calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-start))), black 0, black calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-end))), transparent 0)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-start))), black 0, black calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-end))), transparent 0)',
      },
    },
    scrollbarGutter: {
      compact: {
        selectors: {
          '&[data-has-overflow-x]': {
            paddingBottom: 'var(--spacing-2-5)',
          },
          '&[data-has-overflow-y]': {
            paddingInlineEnd: 'var(--spacing-1)',
          },
        },
      },
      true: {
        selectors: {
          '&[data-has-overflow-x]': {
            paddingBottom: 'var(--spacing-2-5)',
          },
          '&[data-has-overflow-y]': {
            paddingInlineEnd: 'var(--spacing-2-5)',
          },
        },
      },
    },
  },
})

export const scrollbarRecipe = recipe({
  base: {
    selectors: {
      '&[data-hovering], &[data-scrolling]': {
        opacity: 1,
        transitionDelay: '0ms',
        vars: {
          '--transition-duration': '100ms',
        },
        transitionDuration: '100ms',
      },
    },
    display: 'flex',
    margin: 'var(--spacing-1)',
    opacity: 0,
    transition: 'opacity 150ms',
    transitionDelay: '300ms',
  },
  defaultVariants: {
    orientation: 'vertical',
  },
  variants: {
    compact: {
      true: {
        marginTop: 'var(--spacing-2)',
      },
    },
    orientation: {
      horizontal: {
        flexDirection: 'column',
        height: 'var(--sizes-1-5)',
      },
      vertical: {
        width: 'var(--sizes-1-5)',
      },
    },
  },
})

export const thumbRecipe = recipe({
  base: {
    backgroundColor: 'color-mix(in srgb, var(--colors-foreground) 20%, transparent)',
    borderRadius: 'var(--radii-full)',
    flex: '1 1 0%',
    position: 'relative',
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const root = recipe({
  base: {
    height: '100%',
    minHeight: theme.spacing(0),
    width: '100%',
  },
})

export const viewport = recipe({
  base: {
    selectors: {
      '&[data-has-overflow-x]': {
        overscrollBehaviorX: 'contain',
      },
      '&[data-has-overflow-y]': {
        overscrollBehaviorY: 'contain',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: `2px solid ${theme.colors.ring}`,
        outlineOffset: '1px',
      },
    },
    borderRadius: 'inherit',
    height: '100%',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    vars: {
      '--transition-duration': '150ms',
      '--transition-prop': 'box-shadow',
      '--transition-easing': theme.easings['in-out'],
    },
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: theme.easings['in-out'],
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
          'linear-gradient(to bottom, transparent, black min(var(--fade-size), var(--scroll-area-overflow-y-start)), black calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-end))), transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black min(var(--fade-size), var(--scroll-area-overflow-y-start)), black calc(100% - min(var(--fade-size), var(--scroll-area-overflow-y-end))), transparent)',
      },
    },
    scrollbarGutter: {
      compact: {
        selectors: {
          '&[data-has-overflow-x]': {
            paddingBottom: theme.spacing(2.5),
          },
          '&[data-has-overflow-y]': {
            paddingInlineEnd: theme.spacing(1),
          },
        },
      },
      true: {
        selectors: {
          '&[data-has-overflow-x]': {
            paddingBottom: theme.spacing(2.5),
          },
          '&[data-has-overflow-y]': {
            paddingInlineEnd: theme.spacing(2.5),
          },
        },
      },
    },
  },
})

export const scrollbar = recipe({
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
    margin: theme.spacing(1),
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
        marginTop: theme.spacing(2),
      },
    },
    orientation: {
      horizontal: {
        flexDirection: 'column',
        height: theme.spacing(1.5),
      },
      vertical: {
        width: theme.spacing(1.5),
      },
    },
  },
})

export const thumb = recipe({
  base: {
    backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 20%, transparent)`,
    borderRadius: theme.radii.full,
    flex: '1 1 0%',
    position: 'relative',
  },
})

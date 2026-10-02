import { recipe } from '@vanilla-extract/recipes'

import { theme } from '@/design-system/theme'

export const viewport = recipe({
  base: {
    selectors: {
      '&[data-has-overflow-x]': {
        overscrollBehaviorX: 'contain',
      },
      '&[data-has-overflow-y]': {
        overscrollBehaviorY: 'contain',
      },
      '&:focus-visible': {
        outline: `2px solid ${theme.colors.ring}`,
        outlineOffset: '1px',
      },
    },
    borderRadius: theme.radius.inherit,
    height: '100%',
    minHeight: theme.spacing(0),
    outline: '2px solid transparent',
    outlineOffset: '2px',
    overflow: 'auto',
    scrollbarColor: `color-mix(in srgb, ${theme.colors.foreground} 20%, transparent) transparent`,
    scrollbarWidth: 'thin',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: theme.easings['in-out'],
    width: '100%',
  },
  defaultVariants: {
    scrollbarGutter: false,
  },
  variants: {
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

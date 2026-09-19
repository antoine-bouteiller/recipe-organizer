import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const group = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export const separator = recipe({
  base: {
    backgroundColor: theme.colors.border,
    height: '1px',
    width: '100%',
  },
})

export const item = recipe({
  base: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: theme.radius.md,
    borderWidth: '1px',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: theme.fontSizes.sm,
    gap: theme.spacing(4),
    outline: '2px solid transparent',
    outlineOffset: '2px',
    padding: theme.spacing(4),
    transitionDuration: '100ms',
    transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    transitionTimingFunction: theme.easings['in-out'],
    selectors: {
      '&:is(:focus-visible, [data-focus-visible])': {
        borderColor: theme.colors.ring,
        boxShadow: theme.shadows.ring,
      },
    },
  },
  defaultVariants: {
    layout: 'wrap',
    variant: 'default',
  },
  variants: {
    layout: {
      row: {
        flexWrap: 'nowrap',
      },
      wrap: {},
    },
    variant: {
      default: {
        backgroundColor: 'transparent',
      },
      outline: {
        borderColor: theme.colors.border,
      },
    },
  },
})

export const media = recipe({
  base: {
    selectors: {
      '[data-slot=item]:has([data-slot=item-description]) &': {
        alignSelf: 'flex-start',
        transform: 'translateY(2px)',
      },
    },
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: theme.spacing(2),
    justifyContent: 'center',
  },
})

export const content = recipe({
  base: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
})

export const title = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(2),
    lineHeight: theme.lineHeights.snug,
    width: 'fit-content',
  },
})

export const description = recipe({
  base: {
    alignItems: 'center',
    color: theme.colors['muted-foreground'],
    display: 'flex',
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.normal,
    gap: theme.spacing(1),
    lineHeight: theme.lineHeights.normal,
    textWrap: 'balance',
  },
})

export const actions = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(2),
  },
})

globalStyle(`.${description.classNames.base} > a`, {
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
})

globalStyle(`.${description.classNames.base} > a:hover`, {
  '@media': {
    '(hover: hover) and (pointer: fine)': {
      color: theme.colors.primary,
    },
  },
})

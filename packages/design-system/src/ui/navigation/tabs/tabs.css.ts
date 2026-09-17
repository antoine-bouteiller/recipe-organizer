import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const listRecipe = recipe({
  base: {
    selectors: {
      '&[data-orientation=vertical]': {
        flexDirection: 'column',
      },
    },
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radii.lg,
    color: theme.colors['muted-foreground'],
    display: 'flex',
    gap: theme.spacing(0.5),
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    position: 'relative',
    width: 'fit-content',
    zIndex: 0,
  },
  defaultVariants: {
    width: 'fit',
  },
  variants: {
    width: {
      fit: {},
      full: {
        width: '100%',
      },
    },
  },
})

export const indicatorRecipe = recipe({
  base: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    bottom: theme.spacing(0),
    boxShadow: theme.shadows.sm,
    height: 'var(--active-tab-height)',
    left: theme.spacing(0),
    position: 'absolute',
    transform: 'translateX(var(--active-tab-left)) translateY(calc(-1 * var(--active-tab-bottom)))',
    vars: {
      '--transition-duration': '300ms',
      '--transition-prop': 'transform, width, height',
      '--transition-easing': theme.easings.out,
    },
    transitionDuration: '300ms',
    transitionProperty: 'transform, width, height',
    transitionTimingFunction: theme.easings.out,
    width: 'var(--active-tab-width)',
    zIndex: -1,
  },
})

export const tabRecipe = recipe({
  base: {
    selectors: {
      '&[data-active]': {
        color: theme.colors['card-foreground'],
      },
      '&[data-disabled]': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&[data-orientation=vertical]': {
        justifyContent: 'flex-start',
        width: '100%',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: `2px solid ${theme.colors.ring}`,
        outlineOffset: '1px',
      },
      '&:hover:not([data-active])': {
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            color: theme.colors['muted-foreground'],
          },
        },
      },
    },
    vars: {
      '--owner-icon-margin-inline': '-2px',
      '--owner-icon-size': '18px',
      '--transition-duration': '150ms',
      '--transition-prop': 'color, background-color, box-shadow',
      '--transition-easing': theme.easings['in-out'],
    },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: theme.radii.md,
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(1.5),
    height: theme.spacing(9),
    justifyContent: 'center',
    paddingInline: 'calc(10px - 1px)',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'color, background-color, box-shadow',
    transitionTimingFunction: theme.easings['in-out'],
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: theme.fontSizes.sm,
        height: theme.spacing(8),
      },
    },
  },
})

export const rootRecipe = recipe({
  base: {
    selectors: {
      '&[data-orientation=vertical]': {
        flexDirection: 'row',
      },
    },
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minHeight: theme.spacing(0),
  },
})

export const panelsRecipe = recipe({
  base: {
    flex: '1 1 0%',
    minHeight: theme.spacing(0),
    overflow: 'hidden',
  },
})

export const trackRecipe = recipe({
  base: {
    display: 'flex',
    height: '100%',
  },
})

export const panelRecipe = recipe({
  base: {
    flexShrink: 0,
    minWidth: '100%',
    width: '100%',
  },
})

globalStyle(`.${tabRecipe.classNames.base} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

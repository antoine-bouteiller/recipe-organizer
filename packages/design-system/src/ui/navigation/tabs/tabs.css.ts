import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const listRecipe = recipe({
  base: {
    selectors: {
      '&[data-orientation=vertical]': {
        flexDirection: 'column',
      },
      '.dark &': {
        backgroundColor: 'color-mix(in srgb, var(--colors-white) 4%, transparent)',
      },
    },
    alignItems: 'center',
    backgroundColor: 'color-mix(in srgb, var(--colors-white) 50%, transparent)',
    borderRadius: 'var(--radii-lg)',
    color: 'color-mix(in srgb, var(--colors-muted-foreground) 64%, transparent)',
    display: 'flex',
    gap: 'var(--spacing-0-5)',
    justifyContent: 'center',
    padding: 'var(--spacing-0-5)',
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
        width: 'var(--sizes-full)',
      },
    },
  },
})

export const indicatorRecipe = recipe({
  base: {
    backgroundColor: 'var(--colors-background)',
    borderRadius: 'var(--radii-md)',
    bottom: 'var(--spacing-0)',
    boxShadow: 'var(--shadows-sm)',
    height: 'var(--active-tab-height)',
    left: 'var(--spacing-0)',
    position: 'absolute',
    transform: 'translateX(var(--active-tab-left)) translateY(calc(-1 * var(--active-tab-bottom)))',
    vars: {
      '--transition-duration': '300ms',
      '--transition-prop': 'transform, width, height',
      '--transition-easing': 'var(--easings-out)',
    },
    transitionDuration: '300ms',
    transitionProperty: 'transform, width, height',
    transitionTimingFunction: 'var(--easings-out)',
    width: 'var(--active-tab-width)',
    zIndex: -1,
    selectors: {
      '.dark &': {
        backgroundColor: 'var(--colors-accent)',
      },
    },
  },
})

export const tabRecipe = recipe({
  base: {
    selectors: {
      '&[data-active]': {
        color: 'var(--colors-foreground)',
      },
      '&[data-disabled]': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&[data-orientation=vertical]': {
        justifyContent: 'flex-start',
        width: 'var(--sizes-full)',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: '2px solid var(--colors-ring)',
        outlineOffset: '1px',
      },
      '&:hover:not([data-active])': {
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            color: 'var(--colors-muted-foreground)',
          },
        },
      },
    },
    vars: {
      '--owner-icon-margin-inline': '-2px',
      '--owner-icon-size': '18px',
      '--transition-duration': '150ms',
      '--transition-prop': 'color, background-color, box-shadow',
      '--transition-easing': 'var(--easings-in-out)',
    },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 'var(--radii-md)',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    fontSize: 'var(--font-sizes-base)',
    fontWeight: 'var(--font-weights-medium)',
    gap: 'var(--spacing-1-5)',
    height: 'var(--sizes-9)',
    justifyContent: 'center',
    paddingInline: 'calc(10px - 1px)',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'color, background-color, box-shadow',
    transitionTimingFunction: 'var(--easings-in-out)',
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: 'var(--font-sizes-sm)',
        height: 'var(--sizes-8)',
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
    gap: 'var(--spacing-2)',
    minHeight: 'var(--sizes-0)',
  },
})

export const panelsRecipe = recipe({
  base: {
    flex: '1 1 0%',
    minHeight: 'var(--sizes-0)',
    overflow: 'hidden',
  },
})

export const trackRecipe = recipe({
  base: {
    display: 'flex',
    height: 'var(--sizes-full)',
  },
})

export const panelRecipe = recipe({
  base: {
    flexShrink: 0,
    minWidth: 'var(--sizes-full)',
    width: 'var(--sizes-full)',
  },
})

globalStyle(`.${tabRecipe.classNames.base} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

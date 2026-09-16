import { recipe } from '@vanilla-extract/recipes'

export const screenRecipe = recipe({
  base: {
    alignItems: 'center',
    backgroundColor: 'var(--colors-muted)',
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    minHeight: 'var(--sizes-0)',
    overflow: 'hidden',
    position: 'relative',
    width: 'var(--sizes-full)',
    '@media': {
      'screen and (min-width: 768px)': {
        overflow: 'hidden',
        overflowY: 'auto',
      },
    },
  },
})

export const contentRecipe = recipe({
  base: {
    backgroundColor: 'var(--colors-muted)',
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    minHeight: 'var(--sizes-0)',
    overflowY: 'auto',
    paddingInline: 'var(--spacing-4)',
    position: 'relative',
    width: 'var(--sizes-full)',
    zIndex: 10,
    '@media': {
      'screen and (min-width: 768px)': {
        maxWidth: 'var(--sizes-5xl)',
        overflowY: 'visible',
      },
    },
  },
  defaultVariants: {
    hasBackground: false,
    hasFooter: false,
  },
  variants: {
    hasBackground: {
      true: {
        borderTopLeftRadius: 'var(--radii-3xl)',
        borderTopRightRadius: 'var(--radii-3xl)',
        marginTop: 'calc(var(--spacing-10) * -1)',
        paddingTop: 'var(--spacing-1)',
      },
    },
    hasFooter: {
      false: {
        paddingBottom: 'var(--spacing-4)',
      },
      true: {
        paddingBottom: 'calc(env(safe-area-inset-bottom) + var(--spacing-16))',
      },
    },
  },
})

export const imageHeaderRecipe = recipe({
  base: {
    alignItems: 'center',
    background: 'linear-gradient(to bottom, #0d3b42, var(--colors-primary))',
    color: 'var(--colors-primary-foreground)',
    display: 'flex',
    flexShrink: 0,
    gap: 'var(--spacing-2)',
    overflow: 'hidden',
    paddingBottom: 'var(--spacing-12)',
    paddingInline: 'var(--spacing-6)',
    paddingTop: 'calc(env(safe-area-inset-top) + var(--spacing-4))',
    position: 'relative',
    width: 'var(--sizes-full)',
    '@media': {
      'screen and (min-width: 768px)': {
        display: 'none',
      },
    },
  },
})

export const headerRecipe = recipe({
  base: {
    alignItems: 'center',
    color: 'var(--colors-foreground)',
    display: 'flex',
    flexShrink: 0,
    gap: 'var(--spacing-2)',
    height: 'var(--screen-header-height)',
    marginInline: 'calc(var(--spacing-4) * -1)',
    paddingInline: 'var(--spacing-2)',
    paddingTop: 'calc(env(safe-area-inset-top) + var(--spacing-1))',
    pointerEvents: 'none',
    position: 'sticky',
    top: 'var(--spacing-0)',
    width: 'auto',
    zIndex: 20,
    '@media': {
      'screen and (min-width: 768px)': {
        display: 'none',
      },
    },
  },
})

export const titlePillRecipe = recipe({
  base: {
    minWidth: 'var(--sizes-0)',
    paddingBlock: 'var(--spacing-1-5)',
    paddingInline: 'var(--spacing-4)',
  },
})

export const imageRecipe = recipe({
  base: {
    height: 'var(--sizes-full)',
    inset: 'var(--spacing-0)',
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'absolute',
    width: 'var(--sizes-full)',
  },
})

export const imageOverlayRecipe = recipe({
  base: {
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))',
    inset: 'var(--spacing-0)',
    position: 'absolute',
  },
})

export const imageBackRecipe = recipe({
  base: {
    vars: {
      '--owner-icon-size': '16px',
    },
    color: 'var(--colors-white)',
    marginLeft: 'calc(var(--spacing-4) * -1)',
    position: 'relative',
    zIndex: 10,
  },
})

export const imageTitleRecipe = recipe({
  base: {
    flex: '1 1 0%',
    fontFamily: 'var(--fonts-heading)',
    fontSize: 'var(--font-sizes-2xl)',
    fontWeight: 'var(--font-weights-bold)',
    letterSpacing: 'var(--letter-spacings-tight)',
    minWidth: 'var(--sizes-0)',
    overflow: 'hidden',
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
})

export const imageActionRecipe = recipe({
  base: {
    position: 'relative',
    zIndex: 10,
  },
})

export const headerActionRecipe = recipe({
  base: {
    marginInlineStart: 'auto',
    pointerEvents: 'auto',
  },
})

export const titleRecipe = recipe({
  base: {
    fontFamily: 'var(--fonts-heading)',
    fontWeight: 'var(--font-weights-bold)',
    letterSpacing: 'var(--letter-spacings-tight)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    vars: {
      '--transition-duration': '200ms',
      '--transition-prop': 'font-size, line-height',
      '--transition-easing': 'var(--easings-out-snappy)',
    },
    transitionDuration: '200ms',
    transitionProperty: 'font-size, line-height',
    transitionTimingFunction: 'var(--easings-out-snappy)',
    whiteSpace: 'nowrap',
  },
  defaultVariants: {
    scrolled: false,
  },
  variants: {
    scrolled: {
      false: {
        fontSize: 'var(--font-sizes-3xl)',
      },
      true: {
        fontSize: 'var(--font-sizes-base)',
      },
    },
  },
})

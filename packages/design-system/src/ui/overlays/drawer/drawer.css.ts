import { recipe } from '@vanilla-extract/recipes'

export const backdropClassName = recipe({
  base: {
    selectors: {
      '&[data-ending-style]': {
        vars: {
          '--transition-duration': 'calc(var(--drawer-swipe-strength) * 400ms)',
        },
        transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)',
      },
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
      },
      '&[data-swiping]': {
        vars: {
          '--transition-duration': '0ms',
        },
        transitionDuration: '0ms',
      },
    },
    '@supports': {
      '(-webkit-touch-callout: none)': {
        position: 'absolute',
      },
    },
    WebkitBackdropFilter: 'blur(4px)',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'color-mix(in srgb, var(--colors-black) 32%, transparent)',
    inset: 'var(--spacing-0)',
    opacity: 'calc(1 - var(--drawer-swipe-progress))',
    position: 'fixed',
    transition: 'opacity 450ms var(--easings-out-snappy)',
    zIndex: 50,
  },
})

export const viewportClassName = recipe({
  base: {
    vars: {
      '--bleed': 'var(--spacing-12)',
    },
    display: 'grid',
    gridTemplateRows: '1fr auto',
    inset: 'var(--spacing-0)',
    paddingTop: 'var(--spacing-12)',
    position: 'fixed',
    touchAction: 'none',
    zIndex: 50,
  },
})

export const popupClassName = recipe({
  base: {
    selectors: {
      '&:has([data-slot=drawer-bar])': {
        paddingTop: 'var(--spacing-2)',
      },
      '&[data-ending-style]': {
        vars: {
          '--transition-duration': 'calc(var(--drawer-swipe-strength) * 400ms)',
        },
        transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)',
      },
      '&[data-ending-style], &[data-starting-style]': {
        boxShadow: 'none',
        paddingBottom: 'var(--spacing-0)',
        translate: '0 calc(100% + env(safe-area-inset-bottom, 0px))',
      },
      '&[data-swiping]': {
        WebkitUserSelect: 'none',
        userSelect: 'none',
      },
      '&::before': {
        borderTopLeftRadius: 'calc(var(--radii-2xl) - 1px)',
        borderTopRightRadius: 'calc(var(--radii-2xl) - 1px)',
        boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
        content: '""',
        inset: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
      },
      '.dark &::before': {
        boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
      },
      '&::after': {
        backgroundColor: 'var(--colors-popover)',
        content: '""',
        height: 'var(--bleed)',
        insetBlockStart: '100%',
        insetInline: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: 'var(--colors-popover)',
    borderTopLeftRadius: 'var(--radii-2xl)',
    borderTopRightRadius: 'var(--radii-2xl)',
    borderTopWidth: '1px',
    boxShadow: 'var(--shadows-overlay)',
    color: 'var(--colors-popover-foreground)',
    display: 'flex',
    flexDirection: 'column',
    gridRowStart: '2',
    maxHeight: 'var(--sizes-full)',
    minHeight: 'var(--sizes-0)',
    minWidth: 'var(--sizes-0)',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    position: 'relative',
    touchAction: 'none',
    vars: {
      '--transition-duration': '450ms',
      '--transition-prop': 'translate, box-shadow, height, background-color',
      '--transition-easing': 'var(--easings-out-snappy)',
    },
    transitionDuration: '450ms',
    transitionProperty: 'translate, box-shadow, height, background-color',
    transitionTimingFunction: 'var(--easings-out-snappy)',
    translate: '0 var(--drawer-swipe-movement-y)',
    width: 'var(--sizes-full)',
  },
})

export const headerClassName = recipe({
  base: {
    selectors: {
      '&:has(+ [data-slot=drawer-panel])': {
        paddingBottom: 'var(--spacing-3)',
      },
    },
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-6)',
    '@media': {
      'screen and (max-width: 639.96px)': {
        paddingBottom: 'var(--spacing-4)',
      },
    },
  },
})

export const footerClassName = recipe({
  base: {
    backgroundColor: 'color-mix(in srgb, var(--colors-muted) 72%, transparent)',
    borderTopWidth: '1px',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: 'var(--spacing-2)',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + var(--spacing-4))',
    paddingInline: 'var(--spacing-6)',
    paddingTop: 'var(--spacing-4)',
    '@media': {
      'screen and (min-width: 640px)': {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
    },
  },
})

export const titleClassName = recipe({
  base: {
    fontFamily: 'var(--fonts-heading)',
    fontSize: 'var(--font-sizes-xl)',
    fontWeight: 'var(--font-weights-semibold)',
    lineHeight: 'var(--line-heights-none)',
  },
})

export const panelClassName = recipe({
  base: {
    selectors: {
      '[data-slot=drawer-popup]:has([data-slot=drawer-header]) &': {
        paddingTop: 'var(--spacing-1)',
      },
    },
    padding: 'var(--spacing-6)',
  },
})

export const barClassName = recipe({
  base: {
    selectors: {
      '&::before': {
        backgroundColor: 'var(--colors-input)',
        borderRadius: 'var(--radii-full)',
        content: '""',
        height: 'var(--sizes-1)',
        width: 'var(--sizes-12)',
      },
    },
    alignItems: 'center',
    display: 'flex',
    insetBlockStart: 'var(--spacing-0)',
    insetInline: 'var(--spacing-0)',
    justifyContent: 'center',
    padding: 'var(--spacing-3)',
    pointerEvents: 'none',
    position: 'absolute',
    touchAction: 'none',
  },
})

export const container = recipe({
  base: {
    minHeight: 'var(--sizes-0)',
    touchAction: 'auto',
  },
})

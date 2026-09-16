import { recipe } from '@vanilla-extract/recipes'

export const backdropClassName = recipe({
  base: {
    selectors: {
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
      },
    },
    WebkitBackdropFilter: 'blur(4px)',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'color-mix(in srgb, var(--colors-black) 32%, transparent)',
    inset: 'var(--spacing-0)',
    position: 'fixed',
    transition: 'opacity 200ms',
    zIndex: 50,
  },
})

export const viewportClassName = recipe({
  base: {
    display: 'grid',
    gridTemplateRows: '1fr auto 3fr',
    inset: 'var(--spacing-0)',
    justifyItems: 'center',
    padding: 'var(--spacing-4)',
    position: 'fixed',
    zIndex: 50,
    '@media': {
      'screen and (max-width: 639.96px)': {
        gridTemplateRows: '1fr auto',
        padding: 'var(--spacing-0)',
        paddingTop: 'var(--spacing-12)',
      },
    },
  },
})

export const popupClassName = recipe({
  base: {
    selectors: {
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
        '@media': {
          'screen and (min-width: 640px)': {
            scale: '0.98',
          },
          'screen and (max-width: 639.96px)': {
            translate: '0 16px',
          },
        },
      },
      '&::before': {
        borderRadius: 'calc(var(--radii-2xl) - 1px)',
        boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
        content: '""',
        inset: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
        '@media': {
          'screen and (max-width: 639.96px)': {
            display: 'none',
          },
        },
      },
      '.dark &::before': {
        boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: 'var(--colors-popover)',
    borderRadius: 'var(--radii-2xl)',
    borderWidth: '1px',
    boxShadow: 'var(--shadows-overlay)',
    color: 'var(--colors-popover-foreground)',
    display: 'flex',
    flexDirection: 'column',
    gridRowStart: '2',
    maxHeight: 'var(--sizes-full)',
    maxWidth: 'var(--sizes-lg)',
    minHeight: 'var(--sizes-0)',
    minWidth: 'var(--sizes-0)',
    opacity: 'calc(1 - var(--nested-dialogs))',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    vars: {
      '--transition-duration': '200ms',
      '--transition-prop': 'scale, opacity, translate',
      '--transition-easing': 'var(--easings-in-out)',
    },
    transitionDuration: '200ms',
    transitionProperty: 'scale, opacity, translate',
    transitionTimingFunction: 'var(--easings-in-out)',
    width: 'var(--sizes-full)',
    '@media': {
      'screen and (min-width: 640px)': {
        scale: 'calc(1 - 0.1 * var(--nested-dialogs))',
      },
      'screen and (max-width: 639.96px)': {
        borderBottomWidth: '0',
        borderInlineWidth: '0',
        borderRadius: '0',
        maxWidth: 'none',
        transformOrigin: 'bottom',
      },
    },
  },
})

export const headerClassName = recipe({
  base: {
    selectors: {
      '&:has(+ [data-slot=dialog-panel])': {
        paddingBottom: 'var(--spacing-3)',
      },
    },
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
    paddingBlock: 'var(--spacing-4)',
    paddingInline: 'var(--spacing-6)',
    '@media': {
      'screen and (min-width: 640px)': {
        borderBottomLeftRadius: 'calc(var(--radii-2xl) - 1px)',
        borderBottomRightRadius: 'calc(var(--radii-2xl) - 1px)',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
    },
  },
})

export const panelClassName = recipe({
  base: {
    selectors: {
      '&:has(+ [data-slot=dialog-footer]:not([data-plain]))': {
        paddingBottom: 'var(--spacing-1)',
      },
      '[data-slot=dialog-header] + &': {
        paddingTop: 'var(--spacing-1)',
      },
    },
    padding: 'var(--spacing-6)',
  },
})

export const element = recipe({
  base: {
    fontFamily: 'var(--fonts-heading)',
    fontSize: 'var(--font-sizes-xl)',
    fontWeight: 'var(--font-weights-semibold)',
    lineHeight: 'var(--line-heights-none)',
  },
})

export const container = recipe({
  base: {
    insetInlineEnd: 'var(--spacing-2)',
    position: 'absolute',
    top: 'var(--spacing-2)',
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
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
    backgroundColor: `color-mix(in srgb, ${theme.colors.scrim} 32%, transparent)`,
    inset: theme.spacing(0),
    opacity: 'calc(1 - var(--drawer-swipe-progress))',
    position: 'fixed',
    transition: `opacity 450ms ${theme.easings['out-snappy']}`,
    zIndex: 50,
  },
})

export const viewportClassName = recipe({
  base: {
    vars: {
      '--bleed': theme.spacing(12),
    },
    display: 'grid',
    gridTemplateRows: '1fr auto',
    inset: theme.spacing(0),
    paddingTop: theme.spacing(12),
    position: 'fixed',
    touchAction: 'none',
    zIndex: 50,
  },
})

export const popupClassName = recipe({
  base: {
    selectors: {
      '&:has([data-slot=drawer-bar])': {
        paddingTop: theme.spacing(2),
      },
      '&[data-ending-style]': {
        vars: {
          '--transition-duration': 'calc(var(--drawer-swipe-strength) * 400ms)',
        },
        transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)',
      },
      '&[data-ending-style], &[data-starting-style]': {
        boxShadow: 'none',
        paddingBottom: theme.spacing(0),
        translate: '0 calc(100% + env(safe-area-inset-bottom, 0px))',
      },
      '&[data-swiping]': {
        WebkitUserSelect: 'none',
        userSelect: 'none',
      },
      '&::before': {
        borderTopLeftRadius: `calc(${theme.radii['2xl']} - 1px)`,
        borderTopRightRadius: `calc(${theme.radii['2xl']} - 1px)`,
        boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
      '.dark &::before': {
        boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
      },
      '&::after': {
        backgroundColor: theme.colors.popover,
        content: '""',
        height: 'var(--bleed)',
        insetBlockStart: '100%',
        insetInline: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: theme.colors.popover,
    borderTopLeftRadius: theme.radii['2xl'],
    borderTopRightRadius: theme.radii['2xl'],
    borderTopWidth: '1px',
    boxShadow: theme.shadows.overlay,
    color: theme.colors['popover-foreground'],
    display: 'flex',
    flexDirection: 'column',
    gridRowStart: '2',
    maxHeight: '100%',
    minHeight: theme.spacing(0),
    minWidth: theme.spacing(0),
    outline: '2px solid transparent',
    outlineOffset: '2px',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    position: 'relative',
    touchAction: 'none',
    vars: {
      '--transition-duration': '450ms',
      '--transition-prop': 'translate, box-shadow, height, background-color',
      '--transition-easing': theme.easings['out-snappy'],
    },
    transitionDuration: '450ms',
    transitionProperty: 'translate, box-shadow, height, background-color',
    transitionTimingFunction: theme.easings['out-snappy'],
    translate: '0 var(--drawer-swipe-movement-y)',
    width: '100%',
  },
})

export const headerClassName = recipe({
  base: {
    selectors: {
      '&:has(+ [data-slot=drawer-panel])': {
        paddingBottom: theme.spacing(3),
      },
    },
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(6),
    '@media': {
      'screen and (max-width: 639.96px)': {
        paddingBottom: theme.spacing(4),
      },
    },
  },
})

export const footerClassName = recipe({
  base: {
    backgroundColor: `color-mix(in srgb, ${theme.colors.muted} 72%, transparent)`,
    borderTopWidth: '1px',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: theme.spacing(2),
    paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${theme.spacing(4)})`,
    paddingInline: theme.spacing(6),
    paddingTop: theme.spacing(4),
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
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights.none,
  },
})

export const panelClassName = recipe({
  base: {
    selectors: {
      '[data-slot=drawer-popup]:has([data-slot=drawer-header]) &': {
        paddingTop: theme.spacing(1),
      },
    },
    padding: theme.spacing(6),
  },
})

export const barClassName = recipe({
  base: {
    selectors: {
      '&::before': {
        backgroundColor: theme.colors.input,
        borderRadius: theme.radii.full,
        content: '""',
        height: theme.spacing(1),
        width: theme.spacing(12),
      },
    },
    alignItems: 'center',
    display: 'flex',
    insetBlockStart: theme.spacing(0),
    insetInline: theme.spacing(0),
    justifyContent: 'center',
    padding: theme.spacing(3),
    pointerEvents: 'none',
    position: 'absolute',
    touchAction: 'none',
  },
})

export const container = recipe({
  base: {
    minHeight: theme.spacing(0),
    touchAction: 'auto',
  },
})

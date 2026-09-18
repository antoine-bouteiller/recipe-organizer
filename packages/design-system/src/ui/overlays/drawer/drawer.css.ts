import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const backdrop = recipe({
  base: {
    selectors: {
      '&[data-ending-style]': {
        transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)',
      },
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
      },
      '&[data-swiping]': {
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

export const viewport = recipe({
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

export const popup = recipe({
  base: {
    selectors: {
      '&:has([data-slot=drawer-bar])': {
        paddingTop: theme.spacing(2),
      },
      '&[data-ending-style]': {
        transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)',
      },
      '&[data-ending-style], &[data-starting-style]': {
        boxShadow: theme.shadows.none,
        paddingBottom: theme.spacing(0),
        translate: `0 calc(100% + ${theme.safeArea.bottom})`,
      },
      '&[data-swiping]': {
        WebkitUserSelect: 'none',
        userSelect: 'none',
      },
      '&::before': {
        borderTopLeftRadius: theme.radius['2xl'],
        borderTopRightRadius: theme.radius['2xl'],
        boxShadow: theme.shadows.edge,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
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
    borderTopLeftRadius: theme.radius['2xl'],
    borderTopRightRadius: theme.radius['2xl'],
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
    paddingBottom: theme.safeArea.bottom,
    position: 'relative',
    touchAction: 'none',
    transitionDuration: '450ms',
    transitionProperty: 'translate, box-shadow, height, background-color',
    transitionTimingFunction: theme.easings['out-snappy'],
    translate: '0 var(--drawer-swipe-movement-y)',
    width: '100%',
  },
})

export const header = recipe({
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

export const footer = recipe({
  base: {
    backgroundColor: `color-mix(in srgb, ${theme.colors.muted} 72%, transparent)`,
    borderTopWidth: '1px',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: theme.spacing(2),
    paddingBottom: `calc(${theme.safeArea.bottom} + ${theme.spacing(4)})`,
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

export const title = recipe({
  base: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights.none,
  },
})

export const panel = recipe({
  base: {
    selectors: {
      '[data-slot=drawer-popup]:has([data-slot=drawer-header]) &': {
        paddingTop: theme.spacing(1),
      },
    },
    padding: theme.spacing(6),
  },
})

export const bar = recipe({
  base: {
    selectors: {
      '&::before': {
        backgroundColor: theme.colors.input,
        borderRadius: theme.radius.full,
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

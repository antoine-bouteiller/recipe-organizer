import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const backdrop = recipe({
  base: {
    selectors: {
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
      },
    },
    backgroundColor: `color-mix(in srgb, ${theme.colors.scrim} 32%, transparent)`,
    inset: theme.spacing(0),
    position: 'fixed',
    transition: 'opacity 200ms',
    zIndex: 50,
  },
})

export const viewport = recipe({
  base: {
    display: 'grid',
    gridTemplateRows: '1fr auto 3fr',
    inset: theme.spacing(0),
    justifyItems: 'center',
    padding: theme.spacing(4),
    position: 'fixed',
    zIndex: 50,
    '@media': {
      'screen and (max-width: 639.96px)': {
        gridTemplateRows: '1fr auto',
        padding: theme.spacing(0),
        paddingTop: theme.spacing(12),
      },
    },
  },
})

export const popup = recipe({
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
        borderRadius: `calc(${theme.radii['2xl']} - 1px)`,
        boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
        '@media': {
          'screen and (max-width: 639.96px)': {
            display: 'none',
          },
        },
      },
      '.dark &::before': {
        boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radii['2xl'],
    borderWidth: '1px',
    boxShadow: theme.shadows.overlay,
    color: theme.colors['popover-foreground'],
    display: 'flex',
    flexDirection: 'column',
    gridRowStart: '2',
    maxHeight: '100%',
    maxWidth: theme.spacing(128),
    minHeight: theme.spacing(0),
    minWidth: theme.spacing(0),
    opacity: 'calc(1 - var(--nested-dialogs))',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    vars: {
      '--transition-duration': '200ms',
      '--transition-prop': 'scale, opacity, translate',
      '--transition-easing': theme.easings['in-out'],
    },
    transitionDuration: '200ms',
    transitionProperty: 'scale, opacity, translate',
    transitionTimingFunction: theme.easings['in-out'],
    width: '100%',
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

export const header = recipe({
  base: {
    selectors: {
      '&:has(+ [data-slot=dialog-panel])': {
        paddingBottom: theme.spacing(3),
      },
    },
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
    paddingBlock: theme.spacing(4),
    paddingInline: theme.spacing(6),
    '@media': {
      'screen and (min-width: 640px)': {
        borderBottomLeftRadius: `calc(${theme.radii['2xl']} - 1px)`,
        borderBottomRightRadius: `calc(${theme.radii['2xl']} - 1px)`,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
    },
  },
})

export const panel = recipe({
  base: {
    selectors: {
      '&:has(+ [data-slot=dialog-footer]:not([data-plain]))': {
        paddingBottom: theme.spacing(1),
      },
      '[data-slot=dialog-header] + &': {
        paddingTop: theme.spacing(1),
      },
    },
    padding: theme.spacing(6),
  },
})

export const element = recipe({
  base: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights.none,
  },
})

export const container = recipe({
  base: {
    insetInlineEnd: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(2),
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
import { globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const inputGroup = recipe({
  base: {
    selectors: {
      '&:has(:disabled)': {
        opacity: 0.64,
      },
    },
    backgroundColor: 'transparent',
    borderRadius: theme.radius.lg,
    color: theme.colors.foreground,
    position: 'relative',
    width: '100%',
  },
})

export const input = recipe({
  base: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    boxShadow: theme.shadows.none,
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.base,
    height: theme.spacing(9.5),
    lineHeight: '38px',
    minWidth: theme.spacing(0),
    outline: '2px solid transparent',
    outlineOffset: '2px',
    paddingInlineEnd: theme.spacing(3),
    paddingInlineStart: theme.spacing(8.25),
    transition: 'background-color 5000000s ease-in-out 0s',
    width: '100%',
    selectors: {
      '&::placeholder, &[data-placeholder]': {
        color: `color-mix(in srgb, ${theme.colors['muted-foreground']} 72%, transparent)`,
      },
    },
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: theme.fontSizes.sm,
        height: theme.spacing(8.5),
        lineHeight: '34px',
        paddingInlineStart: theme.spacing(7.75),
      },
    },
  },
})

export const addon = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    insetBlock: theme.spacing(0),
    insetInlineStart: '1px',
    opacity: 0.8,
    paddingInlineStart: theme.spacing(2.75),
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 10,
  },
})

export const item = recipe({
  base: {
    selectors: {
      '&[data-disabled]': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&[data-highlighted]': {
        backgroundColor: theme.colors.accent,
        color: theme.colors['accent-foreground'],
      },
    },
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    cursor: 'default',
    display: 'flex',
    fontSize: theme.fontSizes.base,
    minHeight: theme.spacing(8),
    outline: '2px solid transparent',
    outlineOffset: '2px',
    paddingBlock: theme.spacing(1.5),
    paddingInline: theme.spacing(2),
    WebkitUserSelect: 'none',
    userSelect: 'none',
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: theme.fontSizes.sm,
        minHeight: theme.spacing(7),
      },
    },
  },
})

export const empty = recipe({
  base: {
    selectors: {
      '&:not(:empty)': {
        paddingBlock: theme.spacing(6),
      },
    },
    color: theme.colors['muted-foreground'],
    fontSize: theme.fontSizes.base,
    textAlign: 'center',
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: theme.fontSizes.sm,
      },
    },
  },
})

export const list = recipe({
  base: {
    selectors: {
      '&:not(:empty)': {
        padding: theme.spacing(2),
        scrollPaddingBlock: theme.spacing(2),
      },
      '&[data-has-overflow-y]': {
        paddingInlineEnd: theme.spacing(3),
      },
    },
  },
})

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
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: theme.spacing(0),
    padding: theme.spacing(4),
    position: 'fixed',
    zIndex: 50,
  },
})

export const popup = recipe({
  base: {
    selectors: {
      '&[data-ending-style], &[data-starting-style]': {
        opacity: 0,
        scale: '0.98',
      },
      '&[data-nested-dialog-open]': {
        transformOrigin: 'top',
      },
      '&[data-nested][data-ending-style], &[data-nested][data-starting-style]': {
        translate: '0 32px',
      },
      '&::before': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.muted} 72%, transparent)`,
        borderRadius: theme.radius['2xl'],
        boxShadow: theme.shadows.edge,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: theme.colors.popover,
    borderRadius: theme.radius['2xl'],
    borderWidth: '1px',
    boxShadow: theme.shadows.overlay,
    color: theme.colors['popover-foreground'],
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '420px',
    maxWidth: theme.spacing(144),
    minHeight: theme.spacing(0),
    minWidth: theme.spacing(0),
    opacity: 'calc(1 - 0.1 * var(--nested-dialogs))',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    scale: 'calc(1 - 0.1 * var(--nested-dialogs))',
    transitionDuration: '200ms',
    transitionProperty: 'scale, opacity, translate',
    transitionTimingFunction: theme.easings['in-out'],
    translate: '0 calc(-20px * var(--nested-dialogs))',
    width: '100%',
  },
})

export const panel = recipe({
  base: {
    selectors: {
      '&:not(:has(+ [data-slot=command-footer]))': {
        borderBottomLeftRadius: theme.radius['2xl'],
        borderBottomRightRadius: theme.radius['2xl'],
        clipPath: `inset(0 1px 1px 1px round 0 0 ${theme.radius['2xl']} ${theme.radius['2xl']})`,
        WebkitClipPath: `inset(0 1px 1px 1px round 0 0 ${theme.radius['2xl']} ${theme.radius['2xl']})`,
        marginBottom: theme.spacing(-0.25),
      },
      '&::before': {
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: theme.colors.popover,
    borderBottomWidth: '0',
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: '1px',
    boxShadow: theme.shadows.xs,
    clipPath: 'inset(0 1px)',
    WebkitClipPath: 'inset(0 1px)',
    marginInline: theme.spacing(-0.25),
    minHeight: theme.spacing(0),
    position: 'relative',
  },
})

export const footer = recipe({
  base: {
    alignItems: 'center',
    borderBottomLeftRadius: theme.radius['2xl'],
    borderBottomRightRadius: theme.radius['2xl'],
    borderTopWidth: '1px',
    color: theme.colors['muted-foreground'],
    display: 'flex',
    fontSize: theme.fontSizes.xs,
    gap: theme.spacing(2),
    justifyContent: 'space-between',
    paddingBlock: theme.spacing(3),
    paddingInline: theme.spacing(5),
    position: 'relative',
  },
})

export const container = recipe({
  base: {
    paddingBlock: theme.spacing(1.5),
    paddingInline: theme.spacing(2.5),
  },
})

globalStyle(`.${addon.classNames.base} svg:not([data-size])`, {
  height: '18px',
  width: '18px',
})

globalStyle(`.${addon.classNames.base} svg`, {
  marginInline: theme.spacing(-0.5),
})

globalStyle(`.${addon.classNames.base} svg:not([data-size])`, {
  '@media': {
    'screen and (min-width: 640px)': {
      height: '16px',
      width: '16px',
    },
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const screen = recipe({
  base: {
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    minHeight: theme.spacing(0),
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '@media': {
      'screen and (min-width: 768px)': {
        overflow: 'hidden',
        overflowY: 'auto',
      },
    },
  },
})

export const content = recipe({
  base: {
    backgroundColor: theme.colors.muted,
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    minHeight: theme.spacing(0),
    overflowY: 'auto',
    paddingInline: theme.spacing(4),
    position: 'relative',
    width: '100%',
    zIndex: 10,
    '@media': {
      'screen and (min-width: 768px)': {
        maxWidth: theme.spacing(256),
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
        borderTopLeftRadius: theme.radii['3xl'],
        borderTopRightRadius: theme.radii['3xl'],
        marginTop: `calc(${theme.spacing(10)} * -1)`,
        paddingTop: theme.spacing(1),
      },
    },
    hasFooter: {
      false: {
        paddingBottom: theme.spacing(4),
      },
      true: {
        paddingBottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(16)})`,
      },
    },
  },
})

export const imageHeader = recipe({
  base: {
    alignItems: 'center',
    background: `linear-gradient(to bottom, #0d3b42, ${theme.colors.primary})`,
    color: theme.colors['primary-foreground'],
    display: 'flex',
    flexShrink: 0,
    gap: theme.spacing(2),
    overflow: 'hidden',
    paddingBottom: theme.spacing(12),
    paddingInline: theme.spacing(6),
    paddingTop: `calc(env(safe-area-inset-top) + ${theme.spacing(4)})`,
    position: 'relative',
    width: '100%',
    '@media': {
      'screen and (min-width: 768px)': {
        display: 'none',
      },
    },
  },
})

export const header = recipe({
  base: {
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    color: theme.colors.foreground,
    display: 'flex',
    flexShrink: 0,
    gap: theme.spacing(2),
    height: 'var(--screen-header-height)',
    marginInline: `calc(${theme.spacing(4)} * -1)`,
    paddingInline: theme.spacing(4),
    paddingTop: `calc(env(safe-area-inset-top) + ${theme.spacing(1)})`,
    position: 'sticky',
    top: theme.spacing(0),
    width: 'auto',
    zIndex: 20,
    '@media': {
      'screen and (min-width: 768px)': {
        display: 'none',
      },
    },
  },
})

export const image = recipe({
  base: {
    height: '100%',
    inset: theme.spacing(0),
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'absolute',
    width: '100%',
  },
})

export const imageOverlay = recipe({
  base: {
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))',
    inset: theme.spacing(0),
    position: 'absolute',
  },
})

export const imageBack = recipe({
  base: {
    vars: {
      '--owner-icon-size': '16px',
    },
    color: theme.colors['inverse-foreground'],
    marginLeft: `calc(${theme.spacing(4)} * -1)`,
    position: 'relative',
    zIndex: 10,
  },
})

export const imageTitle = recipe({
  base: {
    flex: '1 1 0%',
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontWeights.bold,
    letterSpacing: theme.letterSpacings.tight,
    minWidth: theme.spacing(0),
    overflow: 'hidden',
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
})

export const imageAction = recipe({
  base: {
    position: 'relative',
    zIndex: 10,
  },
})

export const headerAction = recipe({
  base: {
    marginInlineStart: 'auto',
    pointerEvents: 'auto',
  },
})

export const title = recipe({
  base: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes['3xl'],
    fontWeight: theme.fontWeights.bold,
    letterSpacing: theme.letterSpacings.tight,
    minWidth: theme.spacing(0),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const positioner = style({
  WebkitUserSelect: 'none',
  userSelect: 'none',
  zIndex: 50,
})

export const popup = style({
  color: theme.colors.foreground,
  outline: '2px solid transparent',
  outlineOffset: '2px',
  transformOrigin: 'var(--transform-origin)',
})

export const popupFrame = style({
  selectors: {
    '&::before': {
      borderRadius: theme.radius.lg,
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
  borderRadius: theme.radius.lg,
  borderWidth: '1px',
  boxShadow: theme.shadows.overlay,
  height: '100%',
  minWidth: 'var(--anchor-width)',
  position: 'relative',
})

export const list = style({
  maxHeight: 'var(--available-height)',
  overflowY: 'auto',
  padding: theme.spacing(1),
})

const arrow = style({
  alignItems: 'center',
  cursor: 'default',
  display: 'flex',
  height: theme.spacing(6),
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
  zIndex: 50,
})

export const scrollUpArrow = style([
  arrow,
  {
    selectors: {
      '&::before': {
        backgroundImage: `linear-gradient(to bottom, ${theme.colors.popover} 50%, transparent)`,
        borderStartEndRadius: theme.radius.lg,
        borderStartStartRadius: theme.radius.lg,
        content: '""',
        height: '200%',
        insetInline: '1px',
        pointerEvents: 'none',
        position: 'absolute',
        top: '1px',
      },
    },
  },
])

export const scrollDownArrow = style([
  arrow,
  {
    selectors: {
      '&::before': {
        backgroundImage: `linear-gradient(to top, ${theme.colors.popover} 50%, transparent)`,
        borderEndEndRadius: theme.radius.lg,
        borderEndStartRadius: theme.radius.lg,
        bottom: '1px',
        content: '""',
        height: '200%',
        insetInline: '1px',
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
  },
])

export const item = style({
  selectors: {
    '&[data-disabled]': {
      opacity: 0.64,
      pointerEvents: 'none',
    },
    '&[data-highlighted]': {
      backgroundColor: theme.colors.accent,
      color: theme.colors['accent-foreground'],
    },
    '&[data-side="none"]': {
      minWidth: 'calc(var(--anchor-width) + 20px)',
    },
  },
  vars: {
    '--owner-icon-size': '18px',
  },
  alignItems: 'center',
  borderRadius: theme.radius.sm,
  cursor: 'default',
  display: 'grid',
  fontSize: theme.fontSizes.base,
  gap: theme.spacing(2),
  gridTemplateColumns: '16px 1fr',
  minHeight: theme.spacing(8),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingBlock: theme.spacing(1),
  paddingInlineEnd: theme.spacing(4),
  paddingInlineStart: theme.spacing(2),
  '@media': {
    'screen and (min-width: 640px)': {
      vars: {
        '--owner-icon-size': '16px',
      },
      fontSize: theme.fontSizes.sm,
      minHeight: theme.spacing(7),
    },
  },
})

export const icon = style({
  height: theme.spacing(4.5),
  position: 'relative',
  width: theme.spacing(4.5),
  '@media': {
    'screen and (min-width: 640px)': {
      height: theme.spacing(4),
      width: theme.spacing(4),
    },
  },
})

export const indicator = style({
  gridColumnStart: '1',
})

export const itemText = style({
  gridColumnStart: '2',
  minWidth: theme.spacing(0),
})

globalStyle(`.${item} svg`, {
  flexShrink: 0,
  pointerEvents: 'none',
})

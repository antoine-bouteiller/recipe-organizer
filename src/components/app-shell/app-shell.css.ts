import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const element = style({
  background: theme.colors.muted,
  display: 'none',
  position: 'sticky',
  top: theme.spacing(0),
  width: '100%',
  zIndex: 50,
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const container = style({
  height: theme.spacing(9),
  width: theme.spacing(56),
})

export const mainContent = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  minHeight: theme.spacing(0),
  '@media': {
    'screen and (min-width: 768px)': {
      paddingBottom: theme.spacing(0),
    },
  },
})

export const navbar = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
  height: theme.spacing(14),
  paddingInline: theme.spacing(6),
})

export const navigation = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
})

export const actions = style({
  alignItems: 'center',
  display: 'flex',
  flex: '1 1 0%',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
})

export const navbarItem = style({
  selectors: {
    '&[aria-current=page]': {
      color: theme.colors.foreground,
    },
    '&[aria-current=page]::after': {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.full,
      bottom: `calc(${theme.spacing(0.5)} * -1)`,
      content: '""',
      height: theme.spacing(0.5),
      insetInline: theme.spacing(2.5),
      position: 'absolute',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: theme.colors.accent,
          color: theme.colors.foreground,
        },
      },
    },
  },
  borderRadius: theme.radius.md,
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(2.5),
  position: 'relative',
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: theme.easings['in-out'],
})

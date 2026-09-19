import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle, keyframes } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  boxShadow: theme.shadows.xs,
  bottom: theme.spacing(0),
  display: 'flex',
  height: `calc(${theme.spacing(16)} + ${theme.safeArea.bottom})`,
  paddingBottom: theme.safeArea.bottom,
  paddingInline: theme.spacing(2),
  position: 'fixed',
  width: '100%',
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
})

export const tabBarItem = style({
  selectors: {
    '&[aria-current=page]': {
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.semibold,
    },
    '&:is(:focus-visible, [data-focus-visible])': {
      outline: `2px solid ${theme.colors.ring}`,
      outlineOffset: '-2px',
    },
  },
  alignItems: 'center',
  borderRadius: theme.radius.xl,
  color: theme.colors['muted-foreground'],
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.medium,
  gap: theme.spacing(1),
  height: theme.spacing(14),
  justifyContent: 'center',
  lineHeight: theme.lineHeights.snug,
  minWidth: 0,
  transition: `color 150ms ${theme.easings['in-out']}`,
})

export const iconSlot = style({
  alignItems: 'center',
  borderRadius: theme.radius.full,
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing(8),
  justifyContent: 'center',
  maxWidth: '100%',
  position: 'relative',
  width: theme.spacing(16),
  selectors: {
    '&::before': {
      backgroundColor: 'currentColor',
      borderRadius: theme.radius.inherit,
      content: '""',
      inset: 0,
      opacity: 0,
      pointerEvents: 'none',
      position: 'absolute',
      transition: `opacity 150ms ${theme.easings['in-out']}`,
    },
    [`${tabBarItem}:is(:focus-visible, [data-focus-visible], :active, [data-active]) &::before`]: {
      opacity: 0.12,
    },
  },
  vars: {
    '--owner-icon-size': '24px',
  },
})

const indicatorEnter = keyframes({
  from: { opacity: 0, transform: 'scaleX(0.4)' },
  to: { opacity: 1, transform: 'scaleX(1)' },
})

export const activeIconSlot = style([
  iconSlot,
  {
    color: `color-mix(in srgb, ${theme.colors.primary} 15%, ${theme.colors['primary-foreground']})`,
    display: 'none',
    isolation: 'isolate',
    selectors: {
      '&::after': {
        animation: `${indicatorEnter} 200ms cubic-bezier(0.4, 0, 0.2, 1)`,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.full,
        content: '""',
        inset: 0,
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: -1,
      },
    },
  },
])

globalStyle(`.${tabBarItem}[aria-current=page] [data-slot=tab-bar-item-icon-active]`, {
  display: 'flex',
})

globalStyle(`.${tabBarItem}[aria-current=page] [data-slot=tab-bar-item-icon-inactive]`, {
  display: 'none',
})

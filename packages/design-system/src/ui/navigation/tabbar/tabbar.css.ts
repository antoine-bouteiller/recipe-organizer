import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  boxShadow: `0 -1px 3px color-mix(in srgb, ${theme.colors.shadow} 6%, transparent)`,
  bottom: theme.spacing(0),
  display: 'flex',
  height: `calc(${theme.spacing(16)} + env(safe-area-inset-bottom, 0px))`,
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
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

export const tabBarItemClassName = style({
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
  borderRadius: theme.radii.xl,
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

export const iconSlotClassName = style({
  alignItems: 'center',
  borderRadius: theme.radii.full,
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
      borderRadius: 'inherit',
      content: '""',
      inset: 0,
      opacity: 0,
      pointerEvents: 'none',
      position: 'absolute',
      transition: `opacity 150ms ${theme.easings['in-out']}`,
    },
    [`${tabBarItemClassName}:hover &::before`]: {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          opacity: 0.08,
        },
      },
    },
    [`${tabBarItemClassName}:is(:focus-visible, [data-focus-visible], :active, [data-active]) &::before`]: {
      opacity: 0.12,
    },
  },
  vars: {
    '--owner-icon-size': '24px',
  },
})

export const activeIconSlotClassName = style({
  backgroundColor: theme.colors.accent,
  display: 'none',
})

globalStyle(`.${tabBarItemClassName}[aria-current=page] [data-slot=tab-bar-item-icon-active]`, {
  display: 'flex',
})

globalStyle(`.${tabBarItemClassName}[aria-current=page] [data-slot=tab-bar-item-icon-inactive]`, {
  display: 'none',
})

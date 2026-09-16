import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(24px)',
  backdropFilter: 'blur(24px)',
  backgroundColor: `color-mix(in srgb, ${theme.colors.background} 80%, transparent)`,
  borderColor: `color-mix(in srgb, ${theme.colors.border} 60%, transparent)`,
  borderTopWidth: '1px',
  bottom: theme.spacing(0),
  display: 'flex',
  height: theme.spacing(14),
  paddingInline: theme.spacing(4),
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
    },
    '&:is(:active, [data-active])': {
      transform: 'scale(0.97)',
    },
  },
  alignItems: 'center',
  color: theme.colors['muted-foreground'],
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.semibold,
  gap: theme.spacing(1),
  height: theme.spacing(12),
  justifyContent: 'center',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, transform',
    '--transition-easing': theme.easings['out-snappy'],
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, transform',
  transitionTimingFunction: theme.easings['out-snappy'],
})

export const iconSlotClassName = style({
  vars: {
    '--owner-icon-size': '24px',
  },
})

export const activeIconSlotClassName = style({
  display: 'none',
})

globalStyle(`.${tabBarItemClassName}[aria-current=page] [data-slot=tab-bar-item-icon-active]`, {
  display: 'inline',
})

globalStyle(`.${tabBarItemClassName}[aria-current=page] [data-slot=tab-bar-item-icon-inactive]`, {
  display: 'none',
})

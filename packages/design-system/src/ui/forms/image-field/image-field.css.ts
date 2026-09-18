import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  inset: theme.spacing(0),
  position: 'absolute',
})

export const image = style({
  height: '100%',
  objectFit: 'cover',
  width: '100%',
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingBlock: theme.spacing(3),
  paddingInline: theme.spacing(4),
  textAlign: 'center',
})

export const container3 = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  borderRadius: theme.radius.full,
  borderWidth: '1px',
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing(11),
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  width: theme.spacing(11),
})

export const text = style({
  opacity: 0.6,
})

export const text2 = style({
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  marginBottom: theme.spacing(1.5),
})

export const container4 = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const container5 = style({
  position: 'absolute',
  right: theme.spacing(4),
  top: theme.spacing(4),
})

export const element = style({
  alignItems: 'center',
  backgroundColor: `color-mix(in srgb, ${theme.colors.scrim} 60%, transparent)`,
  borderRadius: theme.radius.full,
  color: theme.colors['inverse-foreground'],
  cursor: 'pointer',
  display: 'flex',
  height: theme.spacing(8),
  justifyContent: 'center',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  transitionDuration: '150ms',
  transitionProperty: 'color, box-shadow',
  transitionTimingFunction: theme.easings['in-out'],
  width: theme.spacing(8),
  zIndex: 50,
  selectors: {
    '&:is(:focus-visible, [data-focus-visible])': {
      borderColor: theme.colors.ring,
      boxShadow: theme.shadows.focus,
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: `color-mix(in srgb, ${theme.colors.scrim} 80%, transparent)`,
        },
      },
    },
  },
})

export const element2 = style({
  display: 'none',
})

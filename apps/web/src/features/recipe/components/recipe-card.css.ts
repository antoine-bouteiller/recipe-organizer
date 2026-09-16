import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  background: `color-mix(in srgb, ${theme.colors.highlight} 5%, transparent)`,
  borderRadius: '30px',
  boxShadow: theme.shadows.lg,
  padding: '3px',
  outline: '1',
  outlineColor: `color-mix(in srgb, ${theme.colors.shadow} 5%, transparent)`,
  vars: {
    '--shadow-color': `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)`,
    '--transition-duration': '200ms',
    '--transition-prop': 'transform',
    '--transition-easing': 'ease-out',
  },
  transitionDuration: '200ms',
  transitionProperty: 'transform',
  transitionTimingFunction: 'ease-out',
  selectors: {
    '.dark &': {
      outlineColor: `color-mix(in srgb, ${theme.colors.highlight} 10%, transparent)`,
    },
  },
})

export const container2 = style({
  transform: 'translateY(-2px)',
})

export const container3 = style({
  transform: 'scale(0.99)',
})

export const element = style({
  background: '#1b2426',
  borderRadius: '27px',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)',
  height: theme.spacing(60),
  overflow: 'hidden',
  position: 'relative',
})

export const image = style({
  height: '100%',
  inset: theme.spacing(0),
  objectFit: 'cover',
  position: 'absolute',
  width: '100%',
})

export const container4 = style({
  background: 'linear-gradient(to top,rgba(8,14,14,0.93) 0%,rgba(8,14,14,0.34) 54%,rgba(8,14,14,0) 78%)',
  inset: theme.spacing(0),
  pointerEvents: 'none',
  position: 'absolute',
})

export const container5 = style({
  display: 'flex',
  flexDirection: 'column',
  inset: theme.spacing(0),
  position: 'absolute',
})

export const element2 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  minHeight: theme.spacing(0),
  padding: theme.spacing(4.5),
  paddingBottom: theme.spacing(0),
})

export const container6 = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
})

export const heading = style({
  color: theme.colors['inverse-foreground'],
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.xl,
  fontWeight: theme.fontWeights.normal,
  lineHeight: theme.lineHeights.tight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const container7 = style({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: theme.spacing(4.5),
  paddingInline: theme.spacing(4.5),
  paddingTop: theme.spacing(2),
})

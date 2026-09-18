import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

// Separate object until csstype includes cornerShape; unsupported browsers keep rounded corners.
// oxlint-disable-next-line recipe-oranizer/no-shape-in-symbol-names -- cornerShape is a native CSS property.
const cardCorners = { borderRadius: theme.radius['4xl'], cornerShape: 'squircle' }

export const card = style({
  ...cardCorners,
  background: '#1b2426',
  boxShadow: theme.shadows.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  height: theme.spacing(60),
  isolation: 'isolate',
  overflow: 'hidden',
  padding: theme.spacing(4.5),
  position: 'relative',
  vars: {
    '--shadow-color': `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)`,
    '--transition-duration': '200ms',
    '--transition-prop': 'transform',
    '--transition-easing': 'ease-out',
  },
  transitionDuration: '200ms',
  transitionProperty: 'transform',
  transitionTimingFunction: 'ease-out',
  ':hover': {
    transform: 'translateY(-2px)',
  },
  ':active': {
    transform: 'scale(0.99)',
  },
  '::before': {
    ...cardCorners,
    background: 'linear-gradient(to top,rgba(8,14,14,0.93) 0%,rgba(8,14,14,0.34) 54%,rgba(8,14,14,0) 78%)',
    content: '""',
    inset: theme.spacing(0),
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: -1,
  },
})

export const animatedCard = style([card, 'stagger-in-35'])

export const image = style({
  ...cardCorners,
  height: '100%',
  inset: theme.spacing(0),
  objectFit: 'cover',
  position: 'absolute',
  width: '100%',
  zIndex: -2,
})

export const recipeLink = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  margin: theme.spacing(-4.5, -4.5, 0),
  minHeight: theme.spacing(0),
  outlineOffset: '-2px',
  padding: theme.spacing(4.5, 4.5, 0),
})

export const tags = style({
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

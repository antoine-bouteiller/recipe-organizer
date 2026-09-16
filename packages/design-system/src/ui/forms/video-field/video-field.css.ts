import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'space-between',
  paddingInline: theme.spacing(4),
  width: '100%',
})

export const container2 = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(3),
})

export const container3 = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  borderRadius: theme.radii.full,
  borderWidth: '1px',
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing(10),
  justifyContent: 'center',
  width: theme.spacing(10),
})

export const text = style({
  opacity: 0.6,
})

export const container4 = style({
  display: 'flex',
  flexDirection: 'column',
})

export const text2 = style({
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
})

export const text3 = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.xs,
})

export const element = style({
  alignItems: 'center',
  backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 10%, transparent)`,
  borderRadius: theme.radii.full,
  color: theme.colors.destructive,
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing(8),
  justifyContent: 'center',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    '--transition-easing': theme.easings['in-out'],
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: theme.easings['in-out'],
  width: theme.spacing(8),
  selectors: {
    '&:is(:focus-visible, [data-focus-visible])': {
      borderColor: theme.colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${theme.colors.ring} 50%, transparent)`,
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 20%, transparent)`,
        },
      },
    },
  },
})

export const container5 = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingBlock: theme.spacing(3),
  paddingInline: theme.spacing(4),
  textAlign: 'center',
})

export const container6 = style({
  alignItems: 'center',
  backgroundColor: theme.colors.background,
  borderRadius: theme.radii.full,
  borderWidth: '1px',
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing(11),
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  width: theme.spacing(11),
})

export const text4 = style({
  opacity: 0.6,
})

export const text5 = style({
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  marginBottom: theme.spacing(1.5),
})

export const text6 = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.xs,
  marginBottom: theme.spacing(2),
})

export const container7 = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
})

export const element2 = style({
  display: 'none',
})

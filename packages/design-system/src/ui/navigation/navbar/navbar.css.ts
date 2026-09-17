import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
  height: theme.spacing(14),
  paddingInline: theme.spacing(6),
})

export const element = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
})

export const container2 = style({
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
      borderRadius: theme.radii.full,
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
  borderRadius: theme.radii.md,
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(2.5),
  position: 'relative',
  vars: {
    '--transition-duration': '150ms',
    '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    '--transition-easing': theme.easings['in-out'],
  },
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: theme.easings['in-out'],
})

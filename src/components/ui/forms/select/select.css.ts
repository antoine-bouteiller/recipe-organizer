import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme'

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  minHeight: theme.spacing(0),
  // Popover-owned trigger width, minus the viewport inline padding and popup border.
  minWidth: `calc(var(--anchor-width, 0px) - ${theme.spacing(4)} - 2px)`,
})

export const title = style({
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes.xl,
  fontWeight: theme.fontWeights.semibold,
  lineHeight: theme.lineHeights.none,
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: theme.spacing(0),
  overflowY: 'auto',
})

export const item = style({
  alignItems: 'center',
  borderRadius: theme.radius.sm,
  display: 'flex',
  fontSize: theme.fontSizes.base,
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  width: '100%',
  selectors: {
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: theme.colors.accent,
          color: theme.colors['accent-foreground'],
        },
      },
    },
  },
})

export const label = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const icon = style({
  flexShrink: 0,
})

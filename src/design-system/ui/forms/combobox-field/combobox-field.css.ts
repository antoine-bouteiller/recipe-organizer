import { style } from '@vanilla-extract/css'

import { theme } from '@/design-system/theme'

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(4),
  '@media': {
    'screen and (min-width: 768px)': {
      padding: theme.spacing(0),
      width: theme.spacing(72),
    },
  },
})

export const options = style({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: theme.spacing(64),
  overflowY: 'auto',
})

export const empty = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  padding: theme.spacing(4),
  textAlign: 'center',
})

export const item = style({
  alignItems: 'center',
  borderRadius: theme.radius.sm,
  cursor: 'default',
  display: 'flex',
  fontSize: theme.fontSizes.base,
  gap: theme.spacing(2),
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
    '&:is(:active, [data-active])': {
      backgroundColor: theme.colors.accent,
      color: theme.colors['accent-foreground'],
    },
  },
})

export const truncate = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const icon = style({
  flexShrink: 0,
})

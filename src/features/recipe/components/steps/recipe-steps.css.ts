import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const groups = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  listStyleType: 'decimal',
  maxWidth: '65ch',
  paddingInlineStart: theme.spacing(6),
  width: '100%',
})

export const step = style({
  selectors: {
    '&::marker': {
      color: theme.colors['muted-foreground'],
      fontWeight: theme.fontWeights.semibold,
    },
  },
  fontSize: theme.fontSizes.sm,
  lineHeight: '24px',
  paddingInlineStart: theme.spacing(1),
})

export const text = style({
  whiteSpace: 'pre-line',
})

export const magimix = style({
  marginTop: theme.spacing(2),
})

export const groupName = style({
  display: 'block',
  marginBottom: theme.spacing(2),
})

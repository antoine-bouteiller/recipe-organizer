import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
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
  paddingBlock: theme.spacing(4),
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
  minHeight: theme.spacing(10),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingBlock: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  width: '100%',
  selectors: {
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

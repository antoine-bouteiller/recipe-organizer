import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const text = style({
  color: theme.colors['muted-foreground'],
  paddingBlock: theme.spacing(8),
  textAlign: 'center',
})

export const text2 = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const container = style({
  alignItems: 'center',
  background: theme.colors.muted,
  display: 'flex',
  flexShrink: 0,
  gap: theme.spacing(4),
  paddingBottom: theme.spacing(2),
})

export const container2 = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  marginBottom: theme.spacing(-4),
  minHeight: theme.spacing(0),
})

export const container3 = style({
  height: '100%',
  overflowY: 'auto',
  paddingBottom: theme.spacing(4),
})

export const container4 = style({
  height: '100%',
  overflowY: 'auto',
  paddingBottom: theme.spacing(4),
})

export const container5 = style({
  height: '100%',
  overflowY: 'auto',
  paddingBottom: theme.spacing(4),
})

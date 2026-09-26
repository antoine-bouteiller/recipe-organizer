import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2),
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
})

export const step = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: theme.spacing(2),
})

export const number = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.semibold,
  lineHeight: '34px',
  minWidth: theme.spacing(6),
})

export const editor = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(1),
  minWidth: theme.spacing(0),
})

export const controls = style({
  display: 'flex',
  flexShrink: 0,
})

export const textStep = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: theme.spacing(1),
})

export const magimixStep = style({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
})

export const addMagimix = style({
  alignSelf: 'flex-start',
})

export const magimixTrigger = style({
  cursor: 'pointer',
  textAlign: 'start',
  width: '100%',
})

export const group = style({
  borderRadius: theme.radius.xl,
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
})

export const groupHeader = style({
  alignItems: 'flex-end',
  display: 'flex',
  gap: theme.spacing(2),
})

export const addActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
})

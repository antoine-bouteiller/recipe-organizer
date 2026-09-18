import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const standardScrollFrame = style({
  borderColor: theme.colors.border,
  borderRadius: theme.radius.md,
  borderWidth: '1px',
  height: theme.spacing(56),
  padding: theme.spacing(4),
  width: theme.spacing(80),
})

export const standardScrollContent = style({
  display: 'grid',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
})

export const fadeScrollFrame = style({
  borderColor: theme.colors.border,
  borderRadius: theme.radius.md,
  borderWidth: '1px',
  height: theme.spacing(56),
  padding: theme.spacing(4),
  width: theme.spacing(80),
})

export const fadeScrollContent = style({
  display: 'grid',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
})

export const compactScrollFrame = style({
  height: theme.spacing(56),
  width: theme.spacing(80),
})

export const compactScrollContent = style({
  display: 'grid',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
})

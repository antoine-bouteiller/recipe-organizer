import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const container2 = style({
  borderColor: theme.colors.border,
  borderRadius: theme.radius.md,
  borderWidth: '1px',
  height: theme.spacing(56),
  padding: theme.spacing(4),
  width: theme.spacing(80),
})

export const container3 = style({
  display: 'grid',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
})

export const container4 = style({
  borderColor: theme.colors.border,
  borderRadius: theme.radius.md,
  borderWidth: '1px',
  height: theme.spacing(56),
  padding: theme.spacing(4),
  width: theme.spacing(80),
})

export const container5 = style({
  display: 'grid',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
})

export const container6 = style({
  height: theme.spacing(56),
  width: theme.spacing(80),
})

export const container7 = style({
  display: 'grid',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
})

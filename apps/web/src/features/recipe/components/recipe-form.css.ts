import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const container2 = style({
  display: 'flex',
  gap: theme.spacing(2),
})

export const container3 = style({
  display: 'flex',
  flex: '1 1 0%',
  gap: theme.spacing(2),
  overflow: 'hidden',
})

export const container4 = style({
  flex: '1 1 0%',
  overflow: 'hidden',
})

export const container5 = style({
  flexShrink: 0,
  width: theme.spacing(28),
})

export const container6 = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2),
})

export const container7 = style({
  borderRadius: theme.radii.xl,
  borderWidth: '1px',
  padding: theme.spacing(4),
  position: 'relative',
})

export const container8 = style({
  paddingTop: theme.spacing(2),
})

export const container9 = style({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
})

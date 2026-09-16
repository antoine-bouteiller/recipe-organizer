import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  width: theme.spacing(56),
})

export const text = style({
  position: 'absolute',
  right: theme.spacing(1.5),
  top: theme.spacing(1.5),
})

export const text2 = style({
  aspectRatio: '1 / 1',
})

export const container2 = style({
  alignItems: 'center',
  color: theme.colors.foreground,
  display: 'flex',
  gap: theme.spacing(2),
})

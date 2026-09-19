import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const separator = style({
  backgroundColor: theme.colors.border,
  flexShrink: 0,
  height: '1px',
  width: '100%',
})

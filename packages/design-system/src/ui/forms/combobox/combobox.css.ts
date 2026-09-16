import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const fallbackClassName = style({
  backgroundColor: theme.colors.background,
  borderColor: theme.colors.input,
  borderRadius: theme.radii.lg,
  borderWidth: '1px',
  height: theme.spacing(9),
  width: '100%',
})

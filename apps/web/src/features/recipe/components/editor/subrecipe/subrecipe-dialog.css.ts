import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const subrecipeFields = style({
  display: 'grid',
  gap: theme.spacing(4),
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
})

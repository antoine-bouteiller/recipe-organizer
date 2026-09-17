import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const separator = recipe({
  base: {
    backgroundColor: theme.colors.border,
    flexShrink: 0,
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: {
        height: '1px',
        width: '100%',
      },
      vertical: {
        alignSelf: 'stretch',
        width: '1px',
      },
    },
  },
})

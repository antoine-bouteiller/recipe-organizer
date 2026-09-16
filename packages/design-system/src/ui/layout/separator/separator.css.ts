import { recipe } from '@vanilla-extract/recipes'

export const separatorRecipe = recipe({
  base: {
    backgroundColor: 'var(--colors-border)',
    flexShrink: 0,
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: {
        height: '1px',
        width: 'var(--sizes-full)',
      },
      vertical: {
        alignSelf: 'stretch',
        width: '1px',
      },
    },
  },
})

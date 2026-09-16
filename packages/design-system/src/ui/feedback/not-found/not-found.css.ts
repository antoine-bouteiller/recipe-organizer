import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const rootRecipe = recipe({
  base: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    display: 'flex',
    justifyContent: 'center',
    marginBlock: 'auto',
  },
})

export const stackRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(8),
    textAlign: 'center',
  },
})

export const centeredRecipe = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
  },
})

export const markRecipe = recipe({
  base: {
    height: 'auto',
    width: theme.spacing(48),
  },
})

export const contentRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
})

export const headingRecipe = recipe({
  base: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontWeights.semibold,
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const rootRecipe = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: theme.spacing(6),
    justifyContent: 'center',
    minWidth: theme.spacing(0),
    padding: theme.spacing(4),
  },
})

export const headingRecipe = recipe({
  base: {
    fontSize: theme.fontSizes['5xl'],
    fontWeight: theme.fontWeights.semibold,
  },
})

export const bodyRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    textAlign: 'center',
  },
})

export const subheadingRecipe = recipe({
  base: {
    fontSize: theme.fontSizes['3xl'],
    fontWeight: theme.fontWeights.semibold,
  },
})

export const detailsRecipe = recipe({
  base: {
    borderColor: theme.colors.destructive,
    borderRadius: theme.radii.sm,
    borderWidth: '1px',
    color: theme.colors.destructive,
    fontSize: theme.fontSizes.sm,
    padding: theme.spacing(1),
  },
})

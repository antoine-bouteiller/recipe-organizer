import { recipe } from '@vanilla-extract/recipes'

export const rootRecipe = recipe({
  base: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
    justifyContent: 'center',
    minWidth: 'var(--sizes-0)',
    padding: 'var(--spacing-4)',
  },
})

export const headingRecipe = recipe({
  base: {
    fontSize: 'var(--font-sizes-5xl)',
    fontWeight: 'var(--font-weights-semibold)',
  },
})

export const bodyRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
    textAlign: 'center',
  },
})

export const subheadingRecipe = recipe({
  base: {
    fontSize: 'var(--font-sizes-3xl)',
    fontWeight: 'var(--font-weights-semibold)',
  },
})

export const detailsRecipe = recipe({
  base: {
    borderColor: 'var(--colors-destructive)',
    borderRadius: 'var(--radii-sm)',
    borderWidth: '1px',
    color: 'var(--colors-destructive)',
    fontSize: 'var(--font-sizes-sm)',
    padding: 'var(--spacing-1)',
  },
})

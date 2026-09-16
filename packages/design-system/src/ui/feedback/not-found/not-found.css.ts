import { recipe } from '@vanilla-extract/recipes'

export const rootRecipe = recipe({
  base: {
    alignItems: 'center',
    backgroundColor: 'var(--colors-background)',
    display: 'flex',
    justifyContent: 'center',
    marginBlock: 'auto',
  },
})

export const stackRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-8)',
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
    width: 'var(--sizes-48)',
  },
})

export const contentRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
})

export const headingRecipe = recipe({
  base: {
    color: 'var(--colors-foreground)',
    fontSize: 'var(--font-sizes-2xl)',
    fontWeight: 'var(--font-weights-semibold)',
  },
})

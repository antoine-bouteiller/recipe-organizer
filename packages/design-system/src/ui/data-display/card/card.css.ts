import { recipe } from '@vanilla-extract/recipes'

export const cardRecipe = recipe({
  base: {
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: 'var(--colors-card)',
    borderRadius: 'var(--radii-2xl)',
    borderWidth: '1px',
    color: 'var(--colors-card-foreground)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: 'var(--shadows-xs)',
    selectors: {
      '.dark &': {
        backgroundClip: 'border-box',
        WebkitBackgroundClip: 'border-box',
      },
    },
  },
})

export const headerRecipe = recipe({
  base: {
    alignItems: 'start',
    display: 'grid',
    gap: 'var(--spacing-1-5)',
    gridAutoRows: 'min-content',
    gridTemplateRows: 'auto auto',
    padding: 'var(--spacing-6)',
  },
})

export const titleRecipe = recipe({
  base: {
    fontSize: 'var(--font-sizes-lg)',
    fontWeight: 'var(--font-weights-semibold)',
    lineHeight: 'var(--line-heights-none)',
  },
})

export const descriptionRecipe = recipe({
  base: {
    color: 'var(--colors-muted-foreground)',
    fontSize: 'var(--font-sizes-sm)',
  },
})

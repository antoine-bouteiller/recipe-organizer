import { recipe } from '@vanilla-extract/recipes'

export const skeletonRecipe = recipe({
  base: {
    vars: {
      '--skeleton-highlight': 'color-mix(in srgb, white 64%, transparent)',
    },
    animation: 'var(--animations-skeleton)',
    background: 'linear-gradient(120deg, transparent 40%, var(--skeleton-highlight), transparent 60%) var(--colors-muted) 0 0 / 200% 100% fixed',
    borderRadius: 'var(--radii-sm)',
    selectors: {
      '.dark &': {
        vars: {
          '--skeleton-highlight': 'color-mix(in srgb, white 4%, transparent)',
        },
      },
    },
  },
  variants: {
    preset: {
      'recipe-card': {
        borderRadius: '28px',
        height: 'var(--sizes-60)',
      },
      'recipe-details-text': {
        height: 'var(--sizes-5)',
        width: 'var(--sizes-full)',
      },
      'recipe-details-title': {
        borderRadius: 'var(--radii-lg)',
        height: 'var(--sizes-10)',
        width: 'var(--sizes-full)',
      },
      'recipe-form': {
        height: 'var(--sizes-64)',
        width: 'var(--sizes-full)',
      },
      'search-input': {
        borderRadius: 'var(--radii-xl)',
        height: 'var(--sizes-11)',
        width: 'var(--sizes-full)',
      },
      'search-result': {
        borderRadius: 'var(--radii-2xl)',
        height: 'var(--sizes-20)',
        width: 'var(--sizes-full)',
      },
      'shopping-list-row': {
        height: 'var(--sizes-8)',
        width: 'var(--sizes-full)',
      },
      'shopping-list-title': {
        height: 'var(--sizes-6)',
        width: 'var(--sizes-32)',
      },
    },
  },
})

import { recipe } from '@vanilla-extract/recipes'

export const kbdRecipe = recipe({
  base: {
    vars: {
      '--owner-icon-size': '12px',
    },
    alignItems: 'center',
    backgroundColor: 'var(--colors-secondary)',
    borderRadius: 'var(--radii-sm)',
    color: 'var(--colors-secondary-foreground)',
    display: 'inline-flex',
    fontFamily: 'var(--fonts-sans)',
    fontSize: 'var(--font-sizes-xs)',
    fontWeight: 'var(--font-weights-medium)',
    gap: 'var(--spacing-1)',
    height: 'var(--sizes-5)',
    justifyContent: 'center',
    minWidth: 'var(--sizes-5)',
    paddingInline: 'var(--spacing-1)',
    pointerEvents: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },
})

export const groupRecipe = recipe({
  base: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: 'var(--spacing-1)',
  },
})

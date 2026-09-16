import { recipe } from '@vanilla-extract/recipes'

export const glassPillRecipe = recipe({
  base: {
    pointerEvents: 'auto',
    position: 'relative',
  },
})

export const glassContentRecipe = recipe({
  base: {
    position: 'relative',
  },
})

export const glassSurfaceRecipe = recipe({
  base: {
    WebkitBackdropFilter: 'blur(24px)',
    backdropFilter: 'blur(24px)',
    backgroundColor: 'color-mix(in srgb, var(--colors-background) 80%, transparent)',
    borderColor: 'color-mix(in srgb, var(--colors-border) 60%, transparent)',
    borderRadius: 'var(--radii-full)',
    borderWidth: '1px',
    inset: 'var(--spacing-0)',
    position: 'absolute',
    transition: 'opacity 200ms var(--easings-out-snappy)',
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  defaultVariants: {
    visible: false,
  },
  variants: {
    visible: {
      false: {
        opacity: 0,
      },
      true: {
        opacity: 1,
      },
    },
  },
})

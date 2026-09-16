import { theme } from '@recipe-organizer/design-system/theme'
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
    backgroundColor: `color-mix(in srgb, ${theme.colors.background} 80%, transparent)`,
    borderColor: `color-mix(in srgb, ${theme.colors.border} 60%, transparent)`,
    borderRadius: theme.radii.full,
    borderWidth: '1px',
    inset: theme.spacing(0),
    position: 'absolute',
    transition: `opacity 200ms ${theme.easings['out-snappy']}`,
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

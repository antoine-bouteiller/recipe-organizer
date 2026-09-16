import { recipe } from '@vanilla-extract/recipes'

export const badgeRecipe = recipe({
  base: {
    vars: {
      '--owner-icon-size': '14px',
      '--transition-duration': '150ms',
      '--transition-prop': 'box-shadow',
      '--transition-easing': 'var(--easings-in-out)',
    },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 'var(--radii-sm)',
    borderWidth: '1px',
    display: 'inline-flex',
    flexShrink: 0,
    fontWeight: 'var(--font-weights-medium)',
    gap: 'var(--spacing-1)',
    justifyContent: 'center',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'var(--easings-in-out)',
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-disabled], &:disabled': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: '2px solid var(--colors-ring)',
        outlineOffset: '1px',
      },
    },
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '12px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      default: {
        fontSize: 'var(--font-sizes-sm)',
        height: 'var(--sizes-5-5)',
        minWidth: 'var(--sizes-5-5)',
        paddingInline: 'calc(var(--spacing-1) - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: 'var(--font-sizes-xs)',
            height: 'var(--sizes-4-5)',
            minWidth: 'var(--sizes-4-5)',
          },
        },
      },
      sm: {
        borderRadius: '4px',
        fontSize: 'var(--font-sizes-xs)',
        height: 'var(--sizes-5)',
        minWidth: 'var(--sizes-5)',
        paddingInline: 'calc(var(--spacing-1) - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: '10px',
            height: 'var(--sizes-4)',
            minWidth: 'var(--sizes-4)',
          },
        },
      },
    },
    variant: {
      accent: {
        backgroundColor: 'var(--colors-accent)',
        borderRadius: 'var(--radii-full)',
        color: 'var(--colors-accent-foreground)',
        fontWeight: 'var(--font-weights-semibold)',
      },
      default: {
        backgroundColor: 'var(--colors-primary)',
        color: 'var(--colors-primary-foreground)',
      },
      eyebrow: {
        backgroundColor: 'var(--colors-secondary)',
        borderRadius: 'var(--radii-full)',
        color: 'var(--colors-secondary-foreground)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      },
      overlay: {
        WebkitBackdropFilter: 'blur(4px)',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'color-mix(in srgb, var(--colors-white) 20%, transparent)',
        borderRadius: 'var(--radii-full)',
        color: 'var(--colors-white)',
        fontWeight: 'var(--font-weights-semibold)',
      },
      secondary: {
        backgroundColor: 'var(--colors-secondary)',
        color: 'var(--colors-secondary-foreground)',
      },
    },
  },
})

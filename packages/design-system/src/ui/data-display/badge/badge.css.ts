import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const badgeRecipe = recipe({
  base: {
    vars: {
      '--owner-icon-size': '14px',
      '--transition-duration': '150ms',
      '--transition-prop': 'box-shadow',
      '--transition-easing': theme.easings['in-out'],
    },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: theme.radii.sm,
    borderWidth: '1px',
    display: 'inline-flex',
    flexShrink: 0,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(1),
    justifyContent: 'center',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: theme.easings['in-out'],
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-disabled], &:disabled': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: `2px solid ${theme.colors.ring}`,
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
        fontSize: theme.fontSizes.sm,
        height: theme.spacing(5.5),
        minWidth: theme.spacing(5.5),
        paddingInline: `calc(${theme.spacing(1)} - 1px)`,
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: theme.fontSizes.xs,
            height: theme.spacing(4.5),
            minWidth: theme.spacing(4.5),
          },
        },
      },
      sm: {
        borderRadius: '4px',
        fontSize: theme.fontSizes.xs,
        height: theme.spacing(5),
        minWidth: theme.spacing(5),
        paddingInline: `calc(${theme.spacing(1)} - 1px)`,
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: '10px',
            height: theme.spacing(4),
            minWidth: theme.spacing(4),
          },
        },
      },
    },
    variant: {
      accent: {
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radii.full,
        color: theme.colors['accent-foreground'],
        fontWeight: theme.fontWeights.semibold,
      },
      default: {
        backgroundColor: theme.colors.primary,
        color: theme.colors['primary-foreground'],
      },
      eyebrow: {
        backgroundColor: theme.colors.secondary,
        borderRadius: theme.radii.full,
        color: theme.colors['secondary-foreground'],
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      },
      overlay: {
        WebkitBackdropFilter: 'blur(4px)',
        backdropFilter: 'blur(4px)',
        backgroundColor: `color-mix(in srgb, ${theme.colors.highlight} 20%, transparent)`,
        borderRadius: theme.radii.full,
        color: theme.colors['inverse-foreground'],
        fontWeight: theme.fontWeights.semibold,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.colors['secondary-foreground'],
      },
    },
  },
})

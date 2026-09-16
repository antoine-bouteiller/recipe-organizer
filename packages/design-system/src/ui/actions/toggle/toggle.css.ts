import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const toggleRecipe = recipe({
  base: {
    selectors: {
      '&[data-pressed]': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.input} 64%, transparent)`,
        color: theme.colors['accent-foreground'],
      },
      '&[data-disabled], &:disabled': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&::after': {
        '@media': {
          '(pointer: coarse)': {
            display: 'block',
          },
        },
        content: '""',
        display: 'none',
        inset: theme.spacing(0),
        minHeight: theme.spacing(11),
        minWidth: 'var(--toggle-hit-min-width, 44px)',
        position: 'absolute',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: `2px solid ${theme.colors.ring}`,
        outlineOffset: '1px',
        zIndex: 10,
      },
      '&:hover': {
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            backgroundColor: theme.colors.accent,
          },
        },
      },
    },
    vars: {
      '--owner-icon-margin-inline': '-2px',
      '--owner-icon-opacity': '0.8',
      '--owner-icon-size': '18px',
    },
    alignItems: 'center',
    borderRadius: theme.radii.lg,
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(2),
    height: theme.spacing(9),
    justifyContent: 'center',
    minWidth: theme.spacing(9),
    paddingInline: `calc(${theme.spacing(2)} - 1px)`,
    position: 'relative',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: theme.fontSizes.sm,
        height: theme.spacing(8),
        minWidth: theme.spacing(8),
      },
    },
  },
  defaultVariants: {
    presentation: 'default',
    variant: 'default',
  },
  variants: {
    presentation: {
      default: {},
      filter: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.primary} 12%, transparent)`,
            borderColor: theme.colors.primary,
            color: theme.colors.primary,
          },
        },
      },
    },
    variant: {
      default: {
        borderColor: 'transparent',
      },
      outline: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.input} 64%, transparent)`,
          },
          '.dark &[data-pressed]': {
            backgroundColor: theme.colors.input,
          },
          '.dark &': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.input} 32%, transparent)`,
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&::before': {
            borderRadius: `calc(${theme.radii.lg} - 1px)`,
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
            content: '""',
            inset: theme.spacing(0),
            pointerEvents: 'none',
            position: 'absolute',
          },
          '.dark &::before': {
            boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
          },
          '&:is(:active, [data-active])': {
            boxShadow: 'none',
          },
          '.dark &:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.input} 64%, transparent)`,
              },
            },
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: theme.colors.accent,
              },
            },
          },
        },
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.input,
        boxShadow: theme.shadows.xs,
      },
    },
  },
})

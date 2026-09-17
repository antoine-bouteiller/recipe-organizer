import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const buttonRecipe = recipe({
  base: {
    selectors: {
      '&[data-disabled], &:disabled': {
        opacity: 0.38,
        pointerEvents: 'none',
      },
      '&::before': {
        backgroundColor: 'currentColor',
        borderRadius: 'inherit',
        content: '""',
        inset: theme.spacing(0),
        opacity: 0,
        pointerEvents: 'none',
        position: 'absolute',
        transition: `opacity 150ms ${theme.easings['in-out']}`,
      },
      '&:hover::before': {
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            opacity: 0.08,
          },
        },
      },
      '&:is(:focus-visible, [data-focus-visible], :active, [data-active], [data-pressed], [aria-pressed=true])::before': {
        opacity: 0.12,
      },
      '&:is(:disabled, [data-disabled])::before': {
        opacity: 0,
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
        minWidth: theme.spacing(11),
        position: 'absolute',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: `2px solid ${theme.colors.ring}`,
        outlineOffset: '3px',
      },
    },
    vars: {
      '--owner-icon-margin-inline': '0',
      '--owner-icon-opacity': '1',
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
    justifyContent: 'center',
    position: 'relative',
    transition: `box-shadow 150ms ${theme.easings['in-out']}`,
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: theme.fontSizes.sm,
      },
    },
  },
  defaultVariants: {
    align: 'center',
    size: 'default',
    variant: 'default',
    width: 'auto',
  },
  variants: {
    align: {
      center: {},
      start: {
        justifyContent: 'flex-start',
      },
    },
    size: {
      default: {
        height: theme.spacing(9),
        paddingInline: `calc(${theme.spacing(3)} - 1px)`,
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(8),
          },
        },
      },
      icon: {
        height: theme.spacing(9),
        width: theme.spacing(9),
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(8),
            width: theme.spacing(8),
          },
        },
      },
      'icon-lg': {
        flexShrink: 0,
        height: theme.spacing(10),
        width: theme.spacing(10),
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(9),
            width: theme.spacing(9),
          },
        },
      },
      'icon-sm': {
        height: theme.spacing(8),
        width: theme.spacing(8),
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(7),
            width: theme.spacing(7),
          },
        },
      },
      'icon-xl': {
        vars: {
          '--owner-icon-size': '20px',
        },
        height: theme.spacing(11),
        width: theme.spacing(11),
        '@media': {
          'screen and (min-width: 640px)': {
            vars: {
              '--owner-icon-size': '18px',
            },
            height: theme.spacing(10),
            width: theme.spacing(10),
          },
        },
      },
      'icon-xs': {
        borderRadius: theme.radii.md,
        vars: {
          '--owner-icon-size': '16px',
        },
        height: theme.spacing(7),
        width: theme.spacing(7),
        '@media': {
          'screen and (min-width: 640px)': {
            vars: {
              '--owner-icon-size': '14px',
            },
            height: theme.spacing(6),
            width: theme.spacing(6),
          },
        },
      },
      lg: {
        height: theme.spacing(10),
        paddingInline: 'calc(14px - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(9),
          },
        },
      },
      sm: {
        gap: theme.spacing(1.5),
        height: theme.spacing(8),
        paddingInline: 'calc(10px - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: theme.spacing(7),
          },
        },
      },
    },
    variant: {
      default: {
        backgroundColor: theme.colors.primary,
        borderColor: 'transparent',
        color: theme.colors['primary-foreground'],
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                boxShadow: theme.shadows.sm,
              },
            },
          },
          '&:is(:active, [data-active], [data-pressed], :disabled, [data-disabled])': {
            boxShadow: 'none',
          },
        },
      },
      destructive: {
        backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 80%, ${theme.colors.shadow})`,
        borderColor: 'transparent',
        color: theme.colors['inverse-foreground'],
      },
      'destructive-ghost': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: theme.colors['destructive-foreground'],
      },
      'destructive-outline': {
        backgroundColor: theme.colors.popover,
        borderColor: theme.colors['destructive-foreground'],
        color: theme.colors['destructive-foreground'],
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: theme.colors.foreground,
      },
      'list-action': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderRadius: theme.radii.md,
        color: theme.colors.foreground,
        justifyContent: 'flex-start',
        width: '100%',
      },
      outline: {
        backgroundColor: theme.colors.popover,
        borderColor: theme.colors.input,
        color: theme.colors.foreground,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: 'transparent',
        color: theme.colors['secondary-foreground'],
      },
    },
    width: {
      auto: {},
      full: {
        width: '100%',
      },
    },
  },
})

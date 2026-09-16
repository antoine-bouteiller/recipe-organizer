import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const buttonRecipe = recipe({
  base: {
    selectors: {
      '&[data-pressed]': {
        transform: 'scale(0.97)',
      },
      '&[data-disabled], &:disabled': {
        opacity: 0.64,
        pointerEvents: 'none',
      },
      '&::before': {
        borderRadius: `calc(${theme.radii.lg} - 1px)`,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
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
        outlineOffset: '1px',
      },
      '&:is(:active, [data-active])': {
        transform: 'scale(0.97)',
      },
    },
    vars: {
      '--owner-icon-margin-inline': '0',
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
    justifyContent: 'center',
    position: 'relative',
    transition: `box-shadow 150ms ${theme.easings['out-snappy']}, transform 150ms ${theme.easings['out-snappy']}`,
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
        vars: {
          '--owner-icon-size': '16px',
        },
        borderRadius: theme.radii.md,
        height: theme.spacing(7),
        width: theme.spacing(7),
        selectors: {
          '&::before': {
            borderRadius: `calc(${theme.radii.md} - 1px)`,
          },
        },
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
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.primary} 90%, transparent)`,
            boxShadow: 'none',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 8%, transparent) inset`,
          },
          '&::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.highlight} 16%, transparent) inset`,
          },
          '&[data-disabled]::before, &:disabled::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 8%, transparent) inset`,
          },
          '&:is(:active, [data-active])': {
            boxShadow: 'none',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.primary} 90%, transparent)`,
              },
            },
          },
        },
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        boxShadow: `0 1px 2px 0 color-mix(in oklab, ${theme.colors.primary} 24%, transparent)`,
        color: theme.colors['primary-foreground'],
      },
      destructive: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 90%, transparent)`,
            boxShadow: 'none',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 8%, transparent) inset`,
          },
          '&::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.highlight} 16%, transparent) inset`,
          },
          '&[data-disabled]::before, &:disabled::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 8%, transparent) inset`,
          },
          '&:is(:active, [data-active])': {
            boxShadow: 'none',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 90%, transparent)`,
              },
            },
          },
        },
        backgroundColor: theme.colors.destructive,
        borderColor: theme.colors.destructive,
        boxShadow: `0 1px 2px 0 color-mix(in oklab, ${theme.colors.destructive} 24%, transparent)`,
        color: theme.colors['inverse-foreground'],
      },
      'destructive-ghost': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: theme.colors['destructive-foreground'],
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 8%, transparent)`,
              },
            },
          },
        },
      },
      'destructive-outline': {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 4%, transparent)`,
            borderColor: `color-mix(in srgb, ${theme.colors.destructive} 32%, transparent)`,
            boxShadow: 'none',
          },
          '.dark &': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.input} 32%, transparent)`,
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: 'none',
          },
          '&::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
          },
          '.dark &:not(:disabled):not(:active):not([data-pressed])::before': {
            boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
          },
          '.dark &::before': {
            boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 2%, transparent)`,
          },
          '&[data-disabled]::before, &:disabled::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: 'none',
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
                backgroundColor: `color-mix(in srgb, ${theme.colors.destructive} 4%, transparent)`,
                borderColor: `color-mix(in srgb, ${theme.colors.destructive} 32%, transparent)`,
              },
            },
          },
        },
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backgroundColor: theme.colors.popover,
        borderColor: theme.colors.input,
        boxShadow: theme.shadows.xs,
        color: theme.colors['destructive-foreground'],
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: theme.colors.foreground,
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: theme.colors.accent,
              },
            },
          },
        },
      },
      'list-action': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: theme.colors.foreground,
        justifyContent: 'flex-start',
        width: '100%',
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: theme.colors.accent,
              },
            },
          },
        },
      },
      'media-overlay-card': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.highlight} 12%, transparent)`,
        borderColor: 'transparent',
        color: theme.colors['inverse-foreground'],
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.highlight} 20%, transparent)`,
              },
            },
          },
        },
      },
      'media-overlay-header': {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.highlight} 25%, transparent)`,
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: 'none',
          },
          '&::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
          },
          '.dark &::before': {
            boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])': {
            boxShadow: 'none',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.highlight} 25%, transparent)`,
              },
            },
          },
        },
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        backgroundColor: `color-mix(in srgb, ${theme.colors.highlight} 15%, transparent)`,
        borderColor: `color-mix(in srgb, ${theme.colors.highlight} 20%, transparent)`,
        boxShadow: theme.shadows.xs,
        color: theme.colors['inverse-foreground'],
      },
      outline: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.accent} 50%, transparent)`,
            boxShadow: 'none',
          },
          '.dark &': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.input} 32%, transparent)`,
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: 'none',
          },
          '&::before': {
            boxShadow: `0 1px color-mix(in oklab, ${theme.colors.shadow} 4%, transparent)`,
          },
          '.dark &:not(:disabled):not(:active):not([data-pressed])::before': {
            boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 6%, transparent)`,
          },
          '.dark &::before': {
            boxShadow: `0 -1px color-mix(in oklab, ${theme.colors.highlight} 2%, transparent)`,
          },
          '&[data-disabled]::before, &:disabled::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: 'none',
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
                backgroundColor: `color-mix(in srgb, ${theme.colors.accent} 50%, transparent)`,
              },
            },
          },
        },
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backgroundColor: theme.colors.popover,
        borderColor: theme.colors.input,
        boxShadow: theme.shadows.xs,
        color: theme.colors.foreground,
      },
      'search-trigger': {
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
        backgroundColor: `color-mix(in srgb, ${theme.colors.background} 72%, transparent)`,
        borderColor: theme.colors.input,
        boxShadow: 'none',
        color: theme.colors.foreground,
        selectors: {
          '.dark &': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.input} 48%, transparent)`,
          },
        },
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: 'transparent',
        color: theme.colors['secondary-foreground'],
        selectors: {
          '&:is(:active, [data-active])': {
            backgroundColor: `color-mix(in srgb, ${theme.colors.secondary} 80%, transparent)`,
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: `color-mix(in srgb, ${theme.colors.secondary} 90%, transparent)`,
              },
            },
          },
        },
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

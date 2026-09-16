import { vars } from '@recipe-organizer/design-system/tokens'
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
        borderRadius: 'calc(var(--radii-lg) - 1px)',
        content: '""',
        inset: 'var(--spacing-0)',
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
        inset: 'var(--spacing-0)',
        minHeight: 'var(--sizes-11)',
        minWidth: 'var(--sizes-11)',
        position: 'absolute',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: '2px solid var(--colors-ring)',
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
    borderRadius: 'var(--radii-lg)',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 'var(--font-sizes-base)',
    fontWeight: vars.fontWeights.medium,
    gap: 'var(--spacing-2)',
    justifyContent: 'center',
    position: 'relative',
    transition: 'box-shadow 150ms var(--easings-out-snappy), transform 150ms var(--easings-out-snappy)',
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: 'var(--font-sizes-sm)',
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
        height: 'var(--sizes-9)',
        paddingInline: 'calc(var(--spacing-3) - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-8)',
          },
        },
      },
      icon: {
        height: 'var(--sizes-9)',
        width: 'var(--sizes-9)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-8)',
            width: 'var(--sizes-8)',
          },
        },
      },
      'icon-lg': {
        height: 'var(--sizes-10)',
        width: 'var(--sizes-10)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-9)',
            width: 'var(--sizes-9)',
          },
        },
      },
      'icon-sm': {
        height: 'var(--sizes-8)',
        width: 'var(--sizes-8)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-7)',
            width: 'var(--sizes-7)',
          },
        },
      },
      'icon-xl': {
        vars: {
          '--owner-icon-size': '20px',
        },
        height: 'var(--sizes-11)',
        width: 'var(--sizes-11)',
        '@media': {
          'screen and (min-width: 640px)': {
            vars: {
              '--owner-icon-size': '18px',
            },
            height: 'var(--sizes-10)',
            width: 'var(--sizes-10)',
          },
        },
      },
      'icon-xs': {
        vars: {
          '--owner-icon-size': '16px',
        },
        borderRadius: 'var(--radii-md)',
        height: 'var(--sizes-7)',
        width: 'var(--sizes-7)',
        selectors: {
          '&::before': {
            borderRadius: 'calc(var(--radii-md) - 1px)',
          },
        },
        '@media': {
          'screen and (min-width: 640px)': {
            vars: {
              '--owner-icon-size': '14px',
            },
            height: 'var(--sizes-6)',
            width: 'var(--sizes-6)',
          },
        },
      },
      lg: {
        height: 'var(--sizes-10)',
        paddingInline: 'calc(14px - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-9)',
          },
        },
      },
      sm: {
        gap: 'var(--spacing-1-5)',
        height: 'var(--sizes-8)',
        paddingInline: 'calc(10px - 1px)',
        '@media': {
          'screen and (min-width: 640px)': {
            height: 'var(--sizes-7)',
          },
        },
      },
    },
    variant: {
      default: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: 'color-mix(in srgb, var(--colors-primary) 90%, transparent)',
            boxShadow: 'none',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 8%, transparent) inset',
          },
          '&::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-white) 16%, transparent) inset',
          },
          '&[data-disabled]::before, &:disabled::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 8%, transparent) inset',
          },
          '&:is(:active, [data-active])': {
            boxShadow: 'none',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-primary) 90%, transparent)',
              },
            },
          },
        },
        backgroundColor: 'var(--colors-primary)',
        borderColor: 'var(--colors-primary)',
        boxShadow: '0 1px 2px 0 color-mix(in oklab, var(--colors-primary) 24%, transparent)',
        color: 'var(--colors-primary-foreground)',
      },
      destructive: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 90%, transparent)',
            boxShadow: 'none',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 8%, transparent) inset',
          },
          '&::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-white) 16%, transparent) inset',
          },
          '&[data-disabled]::before, &:disabled::before': {
            boxShadow: 'none',
          },
          '&:is(:active, [data-active])::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 8%, transparent) inset',
          },
          '&:is(:active, [data-active])': {
            boxShadow: 'none',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 90%, transparent)',
              },
            },
          },
        },
        backgroundColor: 'var(--colors-destructive)',
        borderColor: 'var(--colors-destructive)',
        boxShadow: '0 1px 2px 0 color-mix(in oklab, var(--colors-destructive) 24%, transparent)',
        color: 'var(--colors-white)',
      },
      'destructive-ghost': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'var(--colors-destructive-foreground)',
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 8%, transparent)',
              },
            },
          },
        },
      },
      'destructive-outline': {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 4%, transparent)',
            borderColor: 'color-mix(in srgb, var(--colors-destructive) 32%, transparent)',
            boxShadow: 'none',
          },
          '.dark &': {
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 32%, transparent)',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: 'none',
          },
          '&::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
          },
          '.dark &:not(:disabled):not(:active):not([data-pressed])::before': {
            boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
          },
          '.dark &::before': {
            boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 2%, transparent)',
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
                backgroundColor: 'color-mix(in srgb, var(--colors-input) 64%, transparent)',
              },
            },
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-destructive) 4%, transparent)',
                borderColor: 'color-mix(in srgb, var(--colors-destructive) 32%, transparent)',
              },
            },
          },
        },
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backgroundColor: 'var(--colors-popover)',
        borderColor: 'var(--colors-input)',
        boxShadow: 'var(--shadows-xs)',
        color: 'var(--colors-destructive-foreground)',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'var(--colors-foreground)',
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'var(--colors-accent)',
              },
            },
          },
        },
      },
      'list-action': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'var(--colors-foreground)',
        justifyContent: 'flex-start',
        width: 'var(--sizes-full)',
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'var(--colors-accent)',
              },
            },
          },
        },
      },
      'media-overlay-card': {
        backgroundColor: 'color-mix(in srgb, var(--colors-white) 12%, transparent)',
        borderColor: 'transparent',
        color: 'var(--colors-white)',
        selectors: {
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-white) 20%, transparent)',
              },
            },
          },
        },
      },
      'media-overlay-header': {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: 'color-mix(in srgb, var(--colors-white) 25%, transparent)',
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: 'none',
          },
          '&::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
          },
          '.dark &::before': {
            boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
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
                backgroundColor: 'color-mix(in srgb, var(--colors-white) 25%, transparent)',
              },
            },
          },
        },
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'color-mix(in srgb, var(--colors-white) 15%, transparent)',
        borderColor: 'color-mix(in srgb, var(--colors-white) 20%, transparent)',
        boxShadow: 'var(--shadows-xs)',
        color: 'var(--colors-white)',
      },
      outline: {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: 'color-mix(in srgb, var(--colors-accent) 50%, transparent)',
            boxShadow: 'none',
          },
          '.dark &': {
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 32%, transparent)',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&[data-pressed]::before': {
            boxShadow: 'none',
          },
          '&::before': {
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
          },
          '.dark &:not(:disabled):not(:active):not([data-pressed])::before': {
            boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
          },
          '.dark &::before': {
            boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 2%, transparent)',
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
                backgroundColor: 'color-mix(in srgb, var(--colors-input) 64%, transparent)',
              },
            },
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-accent) 50%, transparent)',
              },
            },
          },
        },
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backgroundColor: 'var(--colors-popover)',
        borderColor: 'var(--colors-input)',
        boxShadow: 'var(--shadows-xs)',
        color: 'var(--colors-foreground)',
      },
      'search-trigger': {
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
        backgroundColor: 'color-mix(in srgb, var(--colors-background) 72%, transparent)',
        borderColor: 'var(--colors-input)',
        boxShadow: 'none',
        color: 'var(--colors-foreground)',
        selectors: {
          '.dark &': {
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 48%, transparent)',
          },
        },
      },
      secondary: {
        backgroundColor: 'var(--colors-secondary)',
        borderColor: 'transparent',
        color: 'var(--colors-secondary-foreground)',
        selectors: {
          '&:is(:active, [data-active])': {
            backgroundColor: 'color-mix(in srgb, var(--colors-secondary) 80%, transparent)',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'color-mix(in srgb, var(--colors-secondary) 90%, transparent)',
              },
            },
          },
        },
      },
    },
    width: {
      auto: {},
      full: {
        width: 'var(--sizes-full)',
      },
    },
  },
})

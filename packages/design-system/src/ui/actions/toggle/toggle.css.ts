import { recipe } from '@vanilla-extract/recipes'

export const toggleRecipe = recipe({
  base: {
    selectors: {
      '&[data-pressed]': {
        backgroundColor: 'color-mix(in srgb, var(--colors-input) 64%, transparent)',
        color: 'var(--colors-accent-foreground)',
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
        inset: 'var(--spacing-0)',
        minHeight: 'var(--sizes-11)',
        minWidth: 'var(--toggle-hit-min-width, 44px)',
        position: 'absolute',
      },
      '&:is(:focus-visible, [data-focus-visible])': {
        outline: '2px solid var(--colors-ring)',
        outlineOffset: '1px',
        zIndex: 10,
      },
      '&:hover': {
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            backgroundColor: 'var(--colors-accent)',
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
    borderRadius: 'var(--radii-lg)',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 'var(--font-sizes-base)',
    fontWeight: 'var(--font-weights-medium)',
    gap: 'var(--spacing-2)',
    height: 'var(--sizes-9)',
    justifyContent: 'center',
    minWidth: 'var(--sizes-9)',
    paddingInline: 'calc(var(--spacing-2) - 1px)',
    position: 'relative',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    '@media': {
      'screen and (min-width: 640px)': {
        vars: {
          '--owner-icon-size': '16px',
        },
        fontSize: 'var(--font-sizes-sm)',
        height: 'var(--sizes-8)',
        minWidth: 'var(--sizes-8)',
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
            backgroundColor: 'color-mix(in srgb, var(--colors-primary) 12%, transparent)',
            borderColor: 'var(--colors-primary)',
            color: 'var(--colors-primary)',
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
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 64%, transparent)',
          },
          '.dark &[data-pressed]': {
            backgroundColor: 'var(--colors-input)',
          },
          '.dark &': {
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 32%, transparent)',
          },
          '&[data-disabled], &:disabled': {
            boxShadow: 'none',
          },
          '&::before': {
            borderRadius: 'calc(var(--radii-lg) - 1px)',
            boxShadow: '0 1px color-mix(in oklab, var(--colors-black) 4%, transparent)',
            content: '""',
            inset: 'var(--spacing-0)',
            pointerEvents: 'none',
            position: 'absolute',
          },
          '.dark &::before': {
            boxShadow: '0 -1px color-mix(in oklab, var(--colors-white) 6%, transparent)',
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
                backgroundColor: 'var(--colors-accent)',
              },
            },
          },
        },
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backgroundColor: 'var(--colors-background)',
        borderColor: 'var(--colors-input)',
        boxShadow: 'var(--shadows-xs)',
      },
    },
  },
})

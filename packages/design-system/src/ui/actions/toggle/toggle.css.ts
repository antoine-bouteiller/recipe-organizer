import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const check = style({
  vars: { '--owner-icon-size': '12px', '--owner-icon-margin-inline': theme.spacing(0), '--owner-icon-opacity': '0' },
  alignItems: 'center',
  borderColor: `color-mix(in srgb, ${theme.colors['muted-foreground']} 40%, transparent)`,
  borderRadius: theme.radius.full,
  borderWidth: '2px',
  display: 'flex',
  flexShrink: 0,
  height: '22px',
  justifyContent: 'center',
  width: '22px',
  selectors: {
    '[data-slot="toggle"][data-pressed] > &': {
      vars: { '--owner-icon-opacity': '1' },
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      color: theme.colors['primary-foreground'],
    },
  },
})

export const checkRowContent = style({
  flex: 1,
  selectors: {
    '[data-slot="toggle"][data-pressed] > &': {
      color: theme.colors['muted-foreground'],
      textDecoration: 'line-through',
    },
  },
})

export const toggle = recipe({
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
    borderRadius: theme.radius.lg,
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(2),
    height: theme.spacing(9),
    justifyContent: 'center',
    minWidth: theme.spacing(9),
    paddingInline: theme.spacing(1.75),
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
      'check-row': {
        selectors: {
          '&[data-pressed]': {
            backgroundColor: 'transparent',
            color: 'inherit',
          },
          '&:hover': {
            '@media': {
              '(hover: hover) and (pointer: fine)': {
                backgroundColor: 'transparent',
              },
            },
          },
          '&:last-child': {
            borderBottomWidth: 0,
          },
        },
        borderColor: theme.colors.border,
        borderWidth: 0,
        borderBottomWidth: '1px',
        borderRadius: theme.radius.none,
        fontSize: theme.fontSizes.base,
        fontWeight: theme.fontWeights.normal,
        gap: theme.spacing(3),
        height: 'auto',
        justifyContent: 'flex-start',
        minWidth: 'auto',
        paddingBlock: theme.spacing(3),
        paddingInline: theme.spacing(0),
        textAlign: 'left',
        whiteSpace: 'normal',
        width: '100%',
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: theme.fontSizes.base,
            height: 'auto',
            minWidth: 'auto',
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
            boxShadow: theme.shadows.none,
          },
          '&::before': {
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadows.edge,
            content: '""',
            inset: theme.spacing(0),
            pointerEvents: 'none',
            position: 'absolute',
          },
          '&:is(:active, [data-active])': {
            boxShadow: theme.shadows.none,
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
  compoundVariants: [
    {
      style: { borderColor: theme.colors.border },
      variants: { presentation: 'check-row', variant: 'default' },
    },
  ],
})

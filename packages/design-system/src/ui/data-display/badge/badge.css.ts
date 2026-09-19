import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const badge = recipe({
  base: {
    vars: {
      '--owner-icon-size': '14px',
    },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: theme.radius.sm,
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
        paddingInline: theme.spacing(0.75),
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: theme.fontSizes.xs,
            height: theme.spacing(4.5),
            minWidth: theme.spacing(4.5),
          },
        },
      },
      sm: {
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.xs,
        height: theme.spacing(5),
        minWidth: theme.spacing(5),
        paddingInline: theme.spacing(0.75),
        '@media': {
          'screen and (min-width: 640px)': {
            fontSize: theme.fontSizes.xs,
            height: theme.spacing(4),
            minWidth: theme.spacing(4),
          },
        },
      },
    },
    variant: {
      accent: {
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.full,
        color: theme.colors['accent-foreground'],
        fontWeight: theme.fontWeights.semibold,
      },
      default: {
        backgroundColor: theme.colors.primary,
        color: theme.colors['primary-foreground'],
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.colors['secondary-foreground'],
      },
      'info-subtle': {
        backgroundColor: theme.colors['info-subtle'],
        color: theme.colors['info-subtle-foreground'],
      },
      'destructive-subtle': {
        backgroundColor: theme.colors['destructive-subtle'],
        color: theme.colors['destructive-subtle-foreground'],
      },
      'neutral-subtle': {
        backgroundColor: theme.colors['neutral-subtle'],
        color: theme.colors['neutral-subtle-foreground'],
      },
      'success-subtle': {
        backgroundColor: theme.colors['success-subtle'],
        color: theme.colors['success-subtle-foreground'],
      },
      'warning-subtle': {
        backgroundColor: theme.colors['warning-subtle'],
        color: theme.colors['warning-subtle-foreground'],
      },
    },
  },
})

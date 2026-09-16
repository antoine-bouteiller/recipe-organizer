import { recipe } from '@vanilla-extract/recipes'

export const inputSurface = recipe({
  base: {
    selectors: {
      '&:has(:autofill)': {
        backgroundColor: 'color-mix(in srgb, var(--colors-foreground) 4%, transparent)',
      },
      '&:has(:disabled)': {
        opacity: 0.64,
      },
      '&:has(:disabled, :focus-visible, [aria-invalid])': {
        vars: {
          '--control-shadow': '0 0 0 0 transparent',
        },
      },
      '&:has(:focus-visible)': {
        vars: {
          '--control-ring': '0 0 0 3px color-mix(in oklab, var(--colors-ring) 24%, transparent)',
        },
        borderColor: 'var(--colors-ring)',
      },
      '&:has(:focus-visible):has([aria-invalid=true])': {
        vars: {
          '--control-ring': '0 0 0 3px color-mix(in oklab, var(--colors-destructive) 16%, transparent)',
        },
        borderColor: 'color-mix(in srgb, var(--colors-destructive) 64%, transparent)',
      },
      '&:has([aria-invalid=true])': {
        borderColor: 'color-mix(in srgb, var(--colors-destructive) 36%, transparent)',
      },
      '&:not(:has(:disabled, :focus-visible, [aria-invalid=true]))::before': {
        boxShadow: '0 1px rgb(0 0 0 / 4%)',
      },
      '.dark &:has(:autofill)': {
        backgroundColor: 'color-mix(in srgb, var(--colors-foreground) 8%, transparent)',
      },
      '.dark &:has(:focus-visible):has([aria-invalid=true])': {
        vars: {
          '--control-ring': '0 0 0 3px color-mix(in oklab, var(--colors-destructive) 24%, transparent)',
        },
      },
      '.dark &:not(:has(:disabled, :focus-visible, [aria-invalid=true]))::before': {
        boxShadow: '0 -1px rgb(255 255 255 / 6%)',
      },
      '.dark &': {
        backgroundClip: 'border-box',
        WebkitBackgroundClip: 'border-box',
      },
      '&::before': {
        borderRadius: 'calc(var(--radii-lg) - 1px)',
        content: '""',
        inset: 'var(--spacing-0)',
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    vars: {
      '--control-ring': '0 0 0 0 transparent',
      '--control-shadow': '0 1px 2px 0 rgb(0 0 0 / 5%)',
      '--transition-duration': '150ms',
      '--transition-prop': 'box-shadow',
      '--transition-easing': 'var(--easings-in-out)',
    },
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    borderColor: 'var(--colors-input)',
    borderRadius: 'var(--radii-lg)',
    borderWidth: '1px',
    boxShadow: 'var(--control-ring), var(--control-shadow)',
    color: 'var(--colors-foreground)',
    display: 'inline-flex',
    fontSize: 'var(--font-sizes-base)',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: 'var(--easings-in-out)',
    width: 'var(--sizes-full)',
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: 'var(--font-sizes-sm)',
      },
    },
  },
  defaultVariants: {
    surface: 'default',
  },
  variants: {
    surface: {
      default: {
        backgroundColor: 'var(--colors-background)',
        selectors: {
          '.dark &': {
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 32%, transparent)',
          },
        },
      },
      glass: {
        alignItems: 'center',
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
        backgroundColor: 'color-mix(in srgb, var(--colors-background) 72%, transparent)',
        minWidth: 'var(--sizes-0)',
        selectors: {
          '.dark &': {
            backgroundColor: 'color-mix(in srgb, var(--colors-input) 48%, transparent)',
          },
        },
      },
    },
  },
})

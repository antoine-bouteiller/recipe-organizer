import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const inputSurface = recipe({
  base: {
    selectors: {
      '&:has(:autofill)': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 4%, transparent)`,
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
          '--control-ring': `0 0 0 3px color-mix(in oklab, ${theme.colors.ring} 24%, transparent)`,
        },
        borderColor: theme.colors.ring,
      },
      '&:has(:focus-visible):has([aria-invalid=true])': {
        vars: {
          '--control-ring': `0 0 0 3px color-mix(in oklab, ${theme.colors.destructive} 16%, transparent)`,
        },
        borderColor: `color-mix(in srgb, ${theme.colors.destructive} 64%, transparent)`,
      },
      '&:has([aria-invalid=true])': {
        borderColor: `color-mix(in srgb, ${theme.colors.destructive} 36%, transparent)`,
      },
      '&:not(:has(:disabled, :focus-visible, [aria-invalid=true]))::before': {
        boxShadow: '0 1px rgb(0 0 0 / 4%)',
      },
      '.dark &:has(:autofill)': {
        backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 8%, transparent)`,
      },
      '.dark &:has(:focus-visible):has([aria-invalid=true])': {
        vars: {
          '--control-ring': `0 0 0 3px color-mix(in oklab, ${theme.colors.destructive} 24%, transparent)`,
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
        borderRadius: `calc(${theme.radii.lg} - 1px)`,
        content: '""',
        inset: theme.spacing(0),
        pointerEvents: 'none',
        position: 'absolute',
      },
    },
    vars: {
      '--control-ring': '0 0 0 0 transparent',
      '--control-shadow': '0 1px 2px 0 rgb(0 0 0 / 5%)',
      '--transition-duration': '150ms',
      '--transition-prop': 'box-shadow',
      '--transition-easing': theme.easings['in-out'],
    },
    backgroundColor: theme.colors.background,
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    borderColor: theme.colors.input,
    borderRadius: theme.radii.lg,
    borderWidth: '1px',
    boxShadow: 'var(--control-ring), var(--control-shadow)',
    color: theme.colors.foreground,
    display: 'inline-flex',
    fontSize: theme.fontSizes.base,
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'box-shadow',
    transitionTimingFunction: theme.easings['in-out'],
    width: '100%',
    '@media': {
      'screen and (min-width: 640px)': {
        fontSize: theme.fontSizes.sm,
      },
    },
  },
})

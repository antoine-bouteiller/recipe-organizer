import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const inputSurface = style({
  selectors: {
    '&:has(:autofill)': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 4%, transparent)`,
    },
    '&:has(:disabled)': {
      opacity: 0.64,
    },
    '&:has(:disabled, :focus-visible, [aria-invalid])': {
      boxShadow: theme.shadows.none,
    },
    '&:has(:focus-visible)': {
      borderColor: theme.colors.ring,
      boxShadow: theme.shadows.ring,
      borderWidth: '1px',
    },
    '&:has(:focus-visible):has([aria-invalid=true])': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 64%, transparent)`,
      boxShadow: theme.shadows.ringInvalid,
    },
    '&:has([aria-invalid=true])': {
      borderColor: `color-mix(in srgb, ${theme.colors.destructive} 36%, transparent)`,
    },
    '.dark &:has(:autofill)': {
      backgroundColor: `color-mix(in srgb, ${theme.colors.foreground} 8%, transparent)`,
    },
    '.dark &': {
      backgroundClip: 'border-box',
      WebkitBackgroundClip: 'border-box',
    },
  },
  backgroundColor: theme.colors.background,
  backgroundClip: 'padding-box',
  WebkitBackgroundClip: 'padding-box',
  borderColor: theme.colors.input,
  borderRadius: theme.radius.lg,
  borderWidth: '1px',
  boxShadow: theme.shadows.xs,
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
})

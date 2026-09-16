import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(24px)',
  backdropFilter: 'blur(24px)',
  background: `color-mix(in srgb, ${theme.colors.background} 72%, transparent)`,
  borderColor: theme.colors.input,
  borderRadius: theme.radii.lg,
  borderWidth: '1px',
  boxShadow: theme.shadows.xs,
  color: theme.colors.foreground,
  display: 'inline-flex',
  height: theme.spacing(10),
  justifyContent: 'center',
  vars: {
    '--transition-prop': 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  },
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  width: theme.spacing(10),
  selectors: {
    '.dark &': {
      background: `color-mix(in srgb, ${theme.colors.input} 48%, transparent)`,
    },
    '&:is(:focus-visible, [data-focus-visible])': {
      outlineColor: theme.colors.ring,
      outlineOffset: '1px',
      outlineWidth: '2px',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          background: `color-mix(in srgb, ${theme.colors.accent} 50%, transparent)`,
        },
      },
    },
  },
})

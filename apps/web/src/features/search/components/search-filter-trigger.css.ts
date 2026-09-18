import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const element = style({
  alignItems: 'center',
  background: theme.colors.popover,
  borderColor: theme.colors.input,
  borderRadius: theme.radius.lg,
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
    '&:is(:focus-visible, [data-focus-visible])': {
      outlineColor: theme.colors.ring,
      outlineOffset: '1px',
      outlineWidth: '2px',
    },
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          background: theme.colors.accent,
        },
      },
    },
  },
})

import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const listClassName = style({
  display: 'flex',
  flexDirection: 'column',
})

export const itemClassName = style({
  alignItems: 'center',
  borderRadius: theme.radii.sm,
  display: 'flex',
  fontSize: theme.fontSizes.base,
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  minHeight: theme.spacing(11),
  outline: '2px solid transparent',
  outlineOffset: '2px',
  paddingInline: theme.spacing(2),
  width: '100%',
  selectors: {
    '&:hover': {
      '@media': {
        '(hover: hover) and (pointer: fine)': {
          backgroundColor: theme.colors.accent,
          color: theme.colors['accent-foreground'],
        },
      },
    },
  },
})

export const labelClassName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const iconClassName = style({
  flexShrink: 0,
})

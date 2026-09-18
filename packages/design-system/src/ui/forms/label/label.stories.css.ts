import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const inputExample = style({
  display: 'grid',
  gap: theme.spacing(2),
  width: theme.spacing(80),
})

export const element = style({
  backgroundColor: theme.colors.background,
  border: '1px solid',
  borderColor: theme.colors.input,
  borderRadius: theme.radius.md,
  fontSize: theme.fontSizes.sm,
  height: theme.spacing(9),
  paddingInline: theme.spacing(3),
})

export const disabledInputExample = style({
  display: 'grid',
  gap: theme.spacing(2),
  width: theme.spacing(80),
})

export const disabledInput = style({
  backgroundColor: theme.colors.background,
  border: '1px solid',
  borderColor: theme.colors.input,
  borderRadius: theme.radius.md,
  fontSize: theme.fontSizes.sm,
  height: theme.spacing(9),
  paddingInline: theme.spacing(3),
  selectors: {
    '&[data-disabled], &:disabled': {
      opacity: 0.64,
    },
  },
})

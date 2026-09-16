import { theme } from '@recipe-organizer/design-system/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const section = style({
  selectors: {
    '&:last-child': {
      borderBottomWidth: '0',
      paddingBottom: theme.spacing(0),
    },
  },
  borderBottomWidth: '1px',
  borderColor: theme.colors.border,
  paddingBottom: theme.spacing(8),
})

export const heading = style({
  fontSize: theme.fontSizes.lg,
  fontWeight: theme.fontWeights.semibold,
})

globalStyle(`.${section} > * + *`, {
  marginTop: theme.spacing(4),
})

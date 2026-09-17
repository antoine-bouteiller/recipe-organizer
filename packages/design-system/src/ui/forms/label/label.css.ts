import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const label = style({
  alignItems: 'center',
  color: theme.colors.foreground,
  display: 'inline-flex',
  fontSize: theme.fontSizes.base,
  fontWeight: theme.fontWeights.medium,
  gap: theme.spacing(2),
  lineHeight: '18px',
  '@media': {
    'screen and (min-width: 640px)': {
      fontSize: theme.fontSizes.sm,
      lineHeight: '16px',
    },
  },
})

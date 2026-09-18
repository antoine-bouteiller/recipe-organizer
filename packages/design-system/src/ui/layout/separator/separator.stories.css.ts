import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

export const contentColumn = style({
  width: theme.spacing(80),
})

export const text = style({
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
})

export const separatorMargin = style({
  marginBlock: theme.spacing(3),
})

export const description = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.sm,
})

export const verticalExample = style({
  alignItems: 'center',
  display: 'flex',
  fontSize: theme.fontSizes.sm,
  gap: theme.spacing(3),
  height: theme.spacing(8),
})

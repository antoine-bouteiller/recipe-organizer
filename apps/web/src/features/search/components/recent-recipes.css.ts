import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
})

export const recentRecipes = style({
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
})

export const recentRecipesHeader = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(1),
  paddingTop: theme.spacing(2),
})

export const heading = style({
  color: theme.colors['muted-foreground'],
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.semibold,
  letterSpacing: theme.letterSpacings.wider,
  textTransform: 'uppercase',
})

export const element = style({
  color: theme.colors.primary,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.semibold,
})

import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
})

export const linkedRecipeRow = style({
  display: 'flex',
  gap: theme.spacing(2),
})

export const linkedRecipeFields = style({
  display: 'flex',
  flex: '1 1 0%',
  gap: theme.spacing(2),
  overflow: 'hidden',
})

export const linkedRecipeSelect = style({
  flex: '1 1 0%',
  overflow: 'hidden',
})

export const linkedRecipeRatio = style({
  flexShrink: 0,
  width: theme.spacing(28),
})

export const ingredientGroupsSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2),
})

export const ingredientGroupCard = style({
  borderRadius: theme.radius.xl,
  borderWidth: '1px',
  padding: theme.spacing(4),
  position: 'relative',
})

export const groupNameField = style({
  paddingTop: theme.spacing(2),
})

export const groupRemoveButton = style({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
})

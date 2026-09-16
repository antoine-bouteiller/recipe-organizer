import { theme } from '@recipe-organizer/design-system/theme'
import { style } from '@vanilla-extract/css'

export const storyStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
})

export const storyOutput = style({
  backgroundColor: theme.colors.muted,
  borderRadius: theme.radii.md,
  display: 'block',
  fontSize: theme.fontSizes.xs,
  padding: theme.spacing(3),
})

export const storySections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(8),
  minWidth: theme.spacing(0),
  width: '100%',
})

import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const kbdRecipe = recipe({
  base: {
    vars: {
      '--owner-icon-size': '12px',
    },
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radii.sm,
    color: theme.colors['secondary-foreground'],
    display: 'inline-flex',
    fontFamily: theme.fonts.sans,
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.medium,
    gap: theme.spacing(1),
    height: theme.spacing(5),
    justifyContent: 'center',
    minWidth: theme.spacing(5),
    paddingInline: theme.spacing(1),
    pointerEvents: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },
})

export const groupRecipe = recipe({
  base: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: theme.spacing(1),
  },
})

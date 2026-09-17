import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const card = recipe({
  base: {
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii['2xl'],
    borderWidth: '1px',
    color: theme.colors['card-foreground'],
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: theme.shadows.xs,
    selectors: {
      '.dark &': {
        backgroundClip: 'border-box',
        WebkitBackgroundClip: 'border-box',
      },
    },
  },
})

export const header = recipe({
  base: {
    alignItems: 'start',
    display: 'grid',
    gap: theme.spacing(1.5),
    gridAutoRows: 'min-content',
    gridTemplateRows: 'auto auto',
    padding: theme.spacing(6),
  },
})

export const title = recipe({
  base: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights.none,
  },
})

export const description = recipe({
  base: {
    color: theme.colors['muted-foreground'],
    fontSize: theme.fontSizes.sm,
  },
})

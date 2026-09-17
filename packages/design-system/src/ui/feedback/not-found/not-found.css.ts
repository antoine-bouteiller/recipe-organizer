import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const root = recipe({
  base: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    display: 'flex',
    justifyContent: 'center',
    marginBlock: 'auto',
  },
})

export const stack = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(8),
    textAlign: 'center',
  },
})

export const centered = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
  },
})

export const mark = recipe({
  base: {
    height: 'auto',
    width: theme.spacing(48),
  },
})

export const content = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
})

export const heading = recipe({
  base: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes['2xl'],
    fontWeight: theme.fontWeights.semibold,
  },
})

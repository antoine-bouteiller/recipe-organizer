import { theme } from '@recipe-organizer/design-system/theme'
import { recipe } from '@vanilla-extract/recipes'

export const skeleton = recipe({
  base: {
    vars: {
      '--skeleton-highlight': 'color-mix(in srgb, white 64%, transparent)',
    },
    animation: theme.animations.skeleton,
    background: `linear-gradient(120deg, transparent 40%, var(--skeleton-highlight), transparent 60%) ${theme.colors.muted} 0 0 / 200% 100% fixed`,
    borderRadius: theme.radius.sm,
    selectors: {
      '.dark &': {
        vars: {
          '--skeleton-highlight': 'color-mix(in srgb, white 4%, transparent)',
        },
      },
    },
  },
  variants: {
    preset: {
      'recipe-card': {
        borderRadius: theme.radius['4xl'],
        height: theme.spacing(60),
      },
      'recipe-details-text': {
        height: theme.spacing(5),
        width: '100%',
      },
      'recipe-details-title': {
        borderRadius: theme.radius.lg,
        height: theme.spacing(10),
        width: '100%',
      },
      'search-input': {
        borderRadius: theme.radius.xl,
        height: theme.spacing(11),
        width: '100%',
      },
      'search-result': {
        borderRadius: theme.radius['2xl'],
        height: theme.spacing(20),
        width: '100%',
      },
      'shopping-list-row': {
        height: theme.spacing(8),
        width: '100%',
      },
      'shopping-list-title': {
        height: theme.spacing(6),
        width: theme.spacing(32),
      },
    },
  },
})

import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const skeletonRecipe = cva({
  base: {
    '--skeleton-highlight': 'color-mix(in srgb, white 64%, transparent)',
    _dark: { '--skeleton-highlight': 'color-mix(in srgb, white 4%, transparent)' },
    animation: 'skeleton',
    background: 'linear-gradient(120deg, transparent 40%, var(--skeleton-highlight), transparent 60%) token(colors.muted) 0 0 / 200% 100% fixed',
    borderRadius: 'sm',
  },
  variants: {
    preset: {
      'recipe-card': { borderRadius: '28px', height: '60' },
      'recipe-details-text': { height: '5', width: 'full' },
      'recipe-details-title': { borderRadius: 'lg', height: '10', width: 'full' },
      'recipe-form': { height: '64', width: 'full' },
      'search-input': { borderRadius: 'xl', height: '11', width: 'full' },
      'search-result': { borderRadius: '2xl', height: '20', width: 'full' },
      'shopping-list-row': { height: '8', width: 'full' },
      'shopping-list-title': { height: '6', width: '32' },
    },
  },
})
export interface SkeletonProps {
  preset?:
    | 'recipe-card'
    | 'recipe-details-text'
    | 'recipe-details-title'
    | 'recipe-form'
    | 'search-input'
    | 'search-result'
    | 'shopping-list-row'
    | 'shopping-list-title'
}
export const Skeleton = ({ preset }: SkeletonProps): React.ReactElement => (
  <div aria-hidden className={skeletonRecipe({ preset })} data-slot="skeleton" />
)

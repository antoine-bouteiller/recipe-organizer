import type React from 'react'

import { skeletonRecipe } from './skeleton.css'

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

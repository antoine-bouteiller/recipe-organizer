import type React from 'react'

import * as styles from './skeleton.css'

export interface SkeletonProps {
  preset?:
    | 'recipe-card'
    | 'recipe-details-text'
    | 'recipe-details-title'
    | 'search-input'
    | 'search-result'
    | 'shopping-list-row'
    | 'shopping-list-title'
}
export const Skeleton = ({ preset }: SkeletonProps): React.ReactElement => (
  <div aria-hidden className={styles.skeleton({ preset })} data-slot="skeleton" />
)

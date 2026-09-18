import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'

import * as styles from './search-skeleton.css'

export const SearchSkeleton = () => (
  <>
    <Skeleton preset="search-input" />
    <div className={styles.container}>
      {incrementalArray({ length: 5 }).map((index) => (
        <Skeleton preset="search-result" key={index} />
      ))}
    </div>
  </>
)

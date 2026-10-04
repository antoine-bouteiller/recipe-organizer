<script lang="ts">
  import * as styles from './skeleton.css'

  interface SkeletonProps {
    preset?:
      | 'recipe-card'
      | 'recipe-details-text'
      | 'recipe-details-title'
      | 'search-input'
      | 'search-result'
      | 'shopping-list-row'
      | 'shopping-list-title'
  }
  const { preset }: SkeletonProps = $props()
</script>

<div aria-hidden="true" class={styles.skeleton({ preset })} data-slot="skeleton"></div>

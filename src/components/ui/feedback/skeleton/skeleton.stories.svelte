<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Skeleton from './skeleton.svelte'

  import * as styles from './skeleton.stories.css'

  const { Story } = defineMeta({ component: Skeleton, title: 'Feedback/Skeleton' })
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <Skeleton preset="recipe-details-text" />
    </StorySection>
    <StorySection title="Recipe Card">
      <div class={styles.recipeCardPreview}>
        <Skeleton preset="recipe-card" />
        <Skeleton preset="recipe-details-title" />
        <Skeleton preset="recipe-details-text" />
        <Skeleton preset="recipe-details-text" />
      </div>
    </StorySection>
  </div>
</Story>

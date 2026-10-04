<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Separator from './separator.svelte'

  import * as styles from './separator.stories.css'

  const { Story } = defineMeta({ component: Separator, title: 'Layout/Separator' })
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <div class={styles.contentColumn}>
        <p class={styles.text}>Ingredients</p>
        <div class={styles.separatorMargin}>
          <Separator />
        </div>
        <p class={styles.description}>Serves four people.</p>
      </div>
    </StorySection>
  </div>
</Story>

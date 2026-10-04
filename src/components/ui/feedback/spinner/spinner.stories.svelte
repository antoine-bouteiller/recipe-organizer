<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Spinner from './spinner.svelte'

  import * as styles from './spinner.stories.css'

  const { Story } = defineMeta({ component: Spinner, title: 'Feedback/Spinner' })
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <Spinner />
    </StorySection>
  </div>
</Story>

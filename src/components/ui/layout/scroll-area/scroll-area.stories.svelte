<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import ScrollArea from './scroll-area.svelte'

  import * as styles from './scroll-area.stories.css'

  const { Story } = defineMeta({ component: ScrollArea, title: 'Layout/Scroll Area' })
  const content = Array.from({ length: 20 }, (_item, index) => `Recipe step ${index + 1}`)
</script>

<Story name="Overview" asChild>
  <div class={styles.container}>
    <StorySection title="Default">
      <div class={styles.standardScrollFrame}>
        <ScrollArea>
          <div class={styles.standardScrollContent}>
            {#each content as step (step)}<p>{step}</p>{/each}
          </div>
        </ScrollArea>
      </div>
    </StorySection>
    <StorySection title="With Gutter">
      <div class={styles.standardScrollFrame}>
        <ScrollArea scrollbarGutter>
          <div class={styles.standardScrollContent}>
            {#each content as step (step)}<p>{step}</p>{/each}
          </div>
        </ScrollArea>
      </div>
    </StorySection>
    <StorySection title="Compact Gutter">
      <div class={styles.compactScrollFrame}>
        <ScrollArea aria-label="Compact scrolling" scrollbarGutter="compact">
          <div class={styles.compactScrollContent}>
            {#each content as step (step)}<p>{step}</p>{/each}
          </div>
        </ScrollArea>
      </div>
    </StorySection>
  </div>
</Story>

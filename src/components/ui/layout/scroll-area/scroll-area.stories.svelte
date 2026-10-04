<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import ScrollArea from './scroll-area.svelte'

  const { Story } = defineMeta({ component: ScrollArea, title: 'Layout/Scroll Area' })
  const content = Array.from({ length: 20 }, (_item, index) => `Recipe step ${index + 1}`)
</script>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <div class="standard-scroll-frame">
        <ScrollArea>
          <div class="standard-scroll-content">
            {#each content as step (step)}<p>{step}</p>{/each}
          </div>
        </ScrollArea>
      </div>
    </StorySection>
    <StorySection title="With Gutter">
      <div class="standard-scroll-frame">
        <ScrollArea scrollbarGutter>
          <div class="standard-scroll-content">
            {#each content as step (step)}<p>{step}</p>{/each}
          </div>
        </ScrollArea>
      </div>
    </StorySection>
    <StorySection title="Compact Gutter">
      <div class="compact-scroll-frame">
        <ScrollArea aria-label="Compact scrolling" scrollbarGutter="compact">
          <div class="compact-scroll-content">
            {#each content as step (step)}<p>{step}</p>{/each}
          </div>
        </ScrollArea>
      </div>
    </StorySection>
  </div>
</Story>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }

  .standard-scroll-frame {
    border-color: var(--colors-border);
    border-radius: var(--radius-md);
    border-width: 1px;
    height: 224px;
    padding: 16px;
    width: 320px;
  }

  .standard-scroll-content {
    display: grid;
    font-size: var(--font-sizes-sm);
    gap: 12px;
  }

  .compact-scroll-frame {
    height: 224px;
    width: 320px;
  }

  .compact-scroll-content {
    display: grid;
    font-size: var(--font-sizes-sm);
    gap: 12px;
  }
</style>

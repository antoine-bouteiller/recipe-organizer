<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Separator from './separator.svelte'

  const { Story } = defineMeta({ component: Separator, title: 'Layout/Separator' })
</script>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <div class="content-column">
        <p class="text">Ingredients</p>
        <div class="separator-margin">
          <Separator />
        </div>
        <p class="description">Serves four people.</p>
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

  .content-column {
    width: 320px;
  }

  .text {
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
  }

  .separator-margin {
    margin-block: 12px;
  }

  .description {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
  }
</style>

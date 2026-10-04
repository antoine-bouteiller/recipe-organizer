<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Skeleton from './skeleton.svelte'

  const { Story } = defineMeta({ component: Skeleton, title: 'Feedback/Skeleton' })
</script>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <Skeleton preset="recipe-details-text" />
    </StorySection>
    <StorySection title="Recipe Card">
      <div class="recipe-card-preview">
        <Skeleton preset="recipe-card" />
        <Skeleton preset="recipe-details-title" />
        <Skeleton preset="recipe-details-text" />
        <Skeleton preset="recipe-details-text" />
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

  .recipe-card-preview {
    border-color: var(--colors-border);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    padding: 16px;
    width: 320px;
  }

  .recipe-card-preview > :global(* + *) {
    margin-top: 12px;
  }
</style>

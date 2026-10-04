<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Spinner from './spinner.svelte'

  const { Story } = defineMeta({ component: Spinner, title: 'Feedback/Spinner' })
</script>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <Spinner />
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
</style>

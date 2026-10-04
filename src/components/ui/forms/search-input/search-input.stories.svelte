<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './search-input.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Forms/SearchInput' })
</script>

{#snippet overview()}<div class="story-layout">
    <StorySection title="Default"><Example /></StorySection>
    <StorySection title="With Custom Placeholder"><Example custom /></StorySection>
  </div>{/snippet}
<Story name="Overview" asChild>{@render overview()}</Story>
<Story
  name="Interaction"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const canvas = within(section)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Rechercher…' }), 'tomato')
    await expect(canvas.getByRole('status')).toHaveTextContent('Searching for tomato')
  }}>{@render overview()}</Story
>

<style>
  .story-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }
</style>

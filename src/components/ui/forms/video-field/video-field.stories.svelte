<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import type { FileMetadata } from '@/hooks/use-file-upload.svelte'

  import Example from './video-field.example.svelte'

  const video: FileMetadata = { id: 'recipe-video', name: 'tomato-soup.mp4', size: 1_572_864, type: 'video/mp4', url: 'data:video/mp4;base64,' }
  const { Story } = defineMeta({ component: Example, title: 'Forms/VideoField' })
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const empty = within(within(canvasElement).getByRole('region', { name: 'Empty' }))
    const input = empty.getByLabelText('Recipe video')
    await userEvent.upload(input, new File(['video'], 'recipe.mp4', { type: 'video/mp4' }))
    await expect(empty.getByText('recipe.mp4')).toBeVisible()
    await userEvent.click(empty.getByRole('button', { name: 'Remove video' }))
    await expect(empty.queryByText('recipe.mp4')).not.toBeInTheDocument()

    const oversized = new File(['video'], 'oversized.mp4', { type: 'video/mp4' })
    Object.defineProperty(oversized, 'size', { value: 100 * 1024 * 1024 + 1 })
    await userEvent.upload(input, oversized)
    await expect(empty.queryByText('oversized.mp4')).not.toBeInTheDocument()
  }
</script>

{#snippet overview()}
  <div class="container">
    <StorySection title="Empty">
      <Example />
    </StorySection>
    <StorySection title="Initial Video">
      <Example initialVideo={video} />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialVideo={video} />
    </StorySection>
  </div>
{/snippet}
<Story name="Overview" asChild>{@render overview()}</Story>
<Story name="Interaction" asChild {play} tags={['!dev']}>{@render overview()}</Story>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }
</style>

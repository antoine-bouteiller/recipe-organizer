<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import { PlusIcon } from '@/components/ui/data-display/icons'

  import Button from './button.svelte'

  const { Story } = defineMeta({ component: Button, title: 'Actions/Button' })
</script>

<Story
  name="Interaction States"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Save recipe' })).toHaveFocus()
    await expect(canvas.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  }}
>
  <div class="button-group">
    <Button variant="secondary">Save recipe</Button>
    <Button disabled>Unavailable</Button>
  </div>
</Story>

<Story
  name="Link"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  }}
>
  <Button asLink href="/" size="lg">Home</Button>
</Story>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <Button>Save changes</Button>
    </StorySection>
    <StorySection title="Variants">
      <div class="button-group">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="destructive-outline">Remove</Button>
        <Button variant="destructive-ghost">Delete quietly</Button>
      </div>
    </StorySection>
    <StorySection title="Sizes">
      <div class="size-options">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button align="start" variant="list-action" width="full">List action</Button>
        {#each ['icon-xs', 'icon-sm', 'icon', 'icon-lg', 'icon-xl'] as const as size (size)}
          <Button aria-label={`Add item (${size})`} {size}><PlusIcon /></Button>
        {/each}
      </div>
    </StorySection>
    <StorySection title="Disabled">
      <div class="button-group">
        <Button disabled>Unavailable</Button>
        <Button disabled variant="secondary">Secondary</Button>
        <Button disabled variant="outline">Outline</Button>
        <Button disabled variant="ghost">Ghost</Button>
        <Button disabled variant="destructive">Delete</Button>
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

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .size-options {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>

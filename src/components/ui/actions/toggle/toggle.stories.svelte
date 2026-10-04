<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Toggle from './toggle.svelte'

  const { Story } = defineMeta({ component: Toggle, title: 'Actions/Toggle' })
</script>

<Story
  name="Check Row"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole('button', { name: 'Tomatoes' })
    const disabledRow = canvas.getByRole('button', { name: 'Unavailable item' })

    await userEvent.tab()
    await expect(row).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(row).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(row)
    await expect(row).toHaveAttribute('aria-pressed', 'false')
    await expect(disabledRow).toBeDisabled()
    await expect(disabledRow).toHaveAttribute('aria-pressed', 'false')
  }}
>
  <div class="container">
    <Toggle presentation="check-row">Tomatoes</Toggle><Toggle disabled presentation="check-row">Unavailable item</Toggle>
  </div>
</Story>

<Story name="Overview" asChild>
  <div class="container">
    <StorySection title="Default">
      <Toggle aria-label="Bold text">Bold</Toggle>
    </StorySection>
    <StorySection title="Pressed">
      <Toggle aria-label="Bold text" defaultPressed>Bold</Toggle>
    </StorySection>
    <StorySection title="Outline">
      <Toggle aria-label="Bold text" variant="outline">Bold</Toggle>
    </StorySection>
    <StorySection title="Filter">
      <Toggle aria-label="Filter recipes" defaultPressed presentation="filter">Filter recipes</Toggle>
    </StorySection>
    <StorySection title="Disabled">
      <Toggle aria-label="Bold text" disabled>Bold</Toggle>
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

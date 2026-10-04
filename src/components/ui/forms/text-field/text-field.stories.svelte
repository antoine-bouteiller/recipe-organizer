<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import ErrorsExample from './text-field.errors.example.svelte'
  import Example from './text-field.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Forms/TextField' })
</script>

{#snippet overview()}
  <div class="container">
    <StorySection title="Default">
      <Example />
    </StorySection>
    <StorySection title="Initial Value">
      <Example initialValue="Tomato soup" />
    </StorySection>
    <StorySection title="Invalid">
      <Example initialValue="Tomato soup" invalid />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialValue="Tomato soup" />
    </StorySection>
  </div>
{/snippet}
<Story name="Overview" asChild>{@render overview()}</Story>

<Story
  name="Refreshed Dotted Errors"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Step title' })
    await expect(input).toBeRequired()
    await expect(input).not.toHaveAttribute('aria-invalid')
    await userEvent.click(canvas.getByRole('button', { name: 'Validate' }))
    await expect(canvas.getByRole('alert')).toHaveTextContent('First error')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('First error')
    await userEvent.click(canvas.getByRole('button', { name: 'Next step' }))
    await expect(canvas.getByRole('alert')).toHaveTextContent('Second error')
    await expect(input).toHaveAccessibleDescription('Second error')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear errors' }))
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await expect(input).not.toHaveAttribute('aria-invalid')
    await userEvent.clear(input)
    await userEvent.type(input, 'Edited step')
    await expect(input).toHaveValue('Edited step')
  }}><ErrorsExample /></Story
>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0px;
    width: 100%;
  }
</style>

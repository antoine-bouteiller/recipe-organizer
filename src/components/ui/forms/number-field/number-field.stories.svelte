<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './number-field.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Forms/NumberField' })
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const input = within(section).getByRole('textbox', { name: 'Servings' })
    await userEvent.type(input, '2,5')
    await expect(input).toHaveValue('2,5')
    await userEvent.click(within(section).getByRole('button', { name: 'Increase' }))
    await expect(input).toHaveValue('3.5')
    await userEvent.clear(input)
    await userEvent.type(input, '-3')
    await userEvent.tab()
    await expect(input).toHaveValue('1')
    await expect(within(section).getByRole('button', { name: 'Decrease' })).toBeDisabled()
  }
</script>

{#snippet overview()}
  <div class="container">
    <StorySection title="Default">
      <Example />
    </StorySection>
    <StorySection title="Initial Value">
      <Example initialValue={4} />
    </StorySection>
    <StorySection title="Invalid">
      <Example initialValue={20} invalid />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialValue={4} />
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

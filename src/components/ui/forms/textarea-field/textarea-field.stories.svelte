<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './textarea-field.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Forms/TextareaField' })
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const textarea = within(section).getByRole('textbox', { name: 'Étape' })
    await userEvent.type(textarea, 'Ligne 1{enter}Ligne 2')
    await expect(textarea).toHaveValue('Ligne 1\nLigne 2')
  }
</script>

{#snippet overview()}
  <div class="container">
    <StorySection title="Default">
      <Example />
    </StorySection>
    <StorySection title="Initial Value">
      <Example initialValue={'Mélanger **vivement**.\nLaisser reposer 10 minutes.'} />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialValue="Servir chaud." />
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

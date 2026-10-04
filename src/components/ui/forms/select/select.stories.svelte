<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Example from './select.example.svelte'
  import Select from './select.svelte'

  import * as styles from './select.stories.css'

  const items = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ]
  const { Story } = defineMeta({ component: Example, title: 'Forms/Select' })
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = within(canvas.getByRole('region', { name: 'Default' })).getByRole('button', { name: 'Choose a status' })
    // [VC-6] Standalone controls without a field label retain their placeholder/selected-value name.
    await expect(trigger).toHaveAccessibleName('Choose a status')
    await userEvent.click(trigger)
    const publishedOption = await body.findByRole('button', { name: 'Published' })
    await userEvent.click(publishedOption)
    await waitFor(() => expect(publishedOption).not.toBeInTheDocument())
    await expect(trigger).toHaveAccessibleName('Published')
    await userEvent.click(trigger)
    const archivedOption = await body.findByRole('button', { name: 'Archived' })
    await userEvent.click(archivedOption)
    await waitFor(() => expect(archivedOption).not.toBeInTheDocument())
    await expect(trigger).toHaveAccessibleName('Archived')
  }
</script>

{#snippet overview()}<div class={styles.container}>
    <StorySection title="Default"><Example /></StorySection>
    <StorySection title="Disabled"><Select disabled {items} onValueChange={() => undefined} value="draft" /></StorySection>
    <StorySection title="Empty"><Select items={[]} onValueChange={() => undefined} placeholder="No statuses available" value={null} /></StorySection>
  </div>{/snippet}
<Story name="Overview" asChild {play}>{@render overview()}</Story>
<Story name="Mobile" asChild {play} globals={{ viewport: { isRotated: false, value: 'mobile2' } }}>{@render overview()}</Story>

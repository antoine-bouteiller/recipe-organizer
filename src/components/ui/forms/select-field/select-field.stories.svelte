<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Example from './select-field.example.svelte'

  import * as styles from './select-field.stories.css'

  const { Story } = defineMeta({ component: Example, title: 'Forms/SelectField' })
</script>

{#snippet overview()}
  <div class={styles.container}>
    <StorySection title="Default">
      <Example />
    </StorySection>
    <StorySection title="Initial Value">
      <Example initialValue="published" />
    </StorySection>
    <StorySection title="Disabled">
      <Example disabled initialValue="draft" />
    </StorySection>
  </div>
{/snippet}
<Story name="Overview" asChild>{@render overview()}</Story>
<Story
  name="Value Changes"
  tags={['!dev']}
  args={{ showValue: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Status Sélectionner' })
    const value = canvas.getByRole('status', { name: 'Status value' })
    // [VC-6] The accessible name includes the field label and follows the current value.
    await expect(trigger).toHaveAccessibleName('Status Sélectionner')
    await expect(value).toHaveTextContent(/^undefined$/)
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('button', { name: 'Published' }))
    await waitFor(() => expect(body.queryByRole('button', { name: 'Published' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^published$/)
    await expect(trigger).toHaveAccessibleName('Status Published')
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('button', { name: 'Archived' }))
    await waitFor(() => expect(body.queryByRole('button', { name: 'Archived' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^archived$/)
    await expect(trigger).toHaveAccessibleName('Status Archived')
    await expect(trigger).toHaveFocus()
  }}
/>
<Story
  name="Clear Value"
  tags={['!dev']}
  args={{ allowClear: true, initialValue: 'published', showValue: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Status Published' })
    const value = canvas.getByRole('status', { name: 'Status value' })
    await expect(trigger).toHaveAccessibleName('Status Published')
    await expect(value).toHaveTextContent(/^published$/)
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('button', { name: 'No status' }))
    await waitFor(() => expect(body.queryByRole('button', { name: 'No status' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^undefined$/)
    await expect(trigger).toHaveAccessibleName('Status No status')
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('button', { name: 'Draft' }))
    await waitFor(() => expect(body.queryByRole('button', { name: 'Draft' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^draft$/)
    await expect(trigger).toHaveTextContent('Draft')
  }}
/>
<Story
  name="Disabled Trigger"
  tags={['!dev']}
  args={{ disabled: true, initialValue: 'draft', showValue: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Status Draft' })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    await expect(body.queryByRole('button', { name: 'Published' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('status', { name: 'Status value' })).toHaveTextContent(/^draft$/)
    await expect(trigger).toHaveTextContent('Draft')
    await userEvent.tab()
    await expect(trigger).not.toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(body.queryByRole('button', { name: 'Published' })).not.toBeInTheDocument()
  }}
/>
<Story
  name="Dismiss Without Changes"
  tags={['!dev']}
  args={{ initialValue: 'published', showValue: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Status Published' })
    const value = canvas.getByRole('status', { name: 'Status value' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await body.findByRole('button', { name: 'Draft' })
    await userEvent.tab()
    await expect(body.getByRole('button', { name: 'Draft' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('button', { name: 'Draft' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^published$/)
    await expect(trigger).toHaveTextContent('Published')
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard(' ')
    await body.findByRole('button', { name: 'Draft' })
    await userEvent.tab()
    await expect(body.getByRole('button', { name: 'Draft' })).toHaveFocus()
    // Clicking the field label dismisses without a synthetic trigger click reopening the popup.
    await userEvent.click(canvas.getByText('Status', { exact: true }))
    await waitFor(() => expect(body.queryByRole('button', { name: 'Draft' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^published$/)
    await expect(trigger).toHaveTextContent('Published')
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await body.findByRole('button', { name: 'Draft' })
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(body.queryByRole('button', { name: 'Draft' })).not.toBeInTheDocument())
    await expect(value).toHaveTextContent(/^draft$/)
    await expect(trigger).toHaveTextContent('Draft')
    await expect(trigger).toHaveFocus()
  }}
/>

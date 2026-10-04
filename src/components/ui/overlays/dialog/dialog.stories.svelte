<script module lang="ts">
  import StorySection from '@storybook-helpers/story-section.svelte'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Button from '@/components/ui/actions/button/button.svelte'

  import DialogFormExample from './dialog-form.story.svelte'
  import Dialog from './dialog.svelte'

  const { Story } = defineMeta({ component: Dialog, title: 'Overlays/Dialog' })
  const interaction = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Edit recipe' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Edit recipe' })).toBeVisible())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
    const bareTrigger = canvas.getByRole('button', { name: 'Open search' })
    await userEvent.click(bareTrigger)
    const bare = await body.findByRole('dialog', { name: 'Search' })
    await waitFor(() => expect(within(bare).getByText('Children own the whole popup surface.')).toBeVisible())
    await expect(within(bare).queryByRole('button')).not.toBeInTheDocument()
    const viewport = bare.parentElement
    if (!viewport) {
      throw new Error('The dialog must have an outside-click viewport')
    }
    await userEvent.click(viewport)
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(bareTrigger).toHaveFocus()
  }
</script>

{#snippet overview()}
  <div class="container">
    <StorySection title="Responsive">
      <Dialog cancelLabel="Cancel" title="Edit recipe">
        {#snippet renderTrigger(props)}<Button {...props}>Edit recipe</Button>{/snippet}
        <p>Changes are saved only after you confirm this action.</p>
        {#snippet footer()}<Button>Save changes</Button>{/snippet}
      </Dialog>
    </StorySection>
    <StorySection title="Bare">
      <Dialog bare title="Search">
        {#snippet renderTrigger(props)}<Button {...props}>Open search</Button>{/snippet}
        <p>Children own the whole popup surface.</p>
      </Dialog>
    </StorySection>
  </div>
{/snippet}

<Story name="Overview" asChild play={interaction}>{@render overview()}</Story>
<Story name="Mobile" asChild globals={{ viewport: { isRotated: false, value: 'mobile2' } }} play={interaction}>{@render overview()}</Story>
<Story
  name="Form Ownership"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Edit nested form' })
    await userEvent.click(trigger)
    const dialog = within(await body.findByRole('dialog', { name: 'Nested recipe form' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Refresh form values' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await userEvent.click(trigger)
    const reopened = within(await body.findByRole('dialog', { name: 'Nested recipe form' }))
    await userEvent.type(reopened.getByRole('textbox', { name: 'Recipe name' }), 'Tomato soup{Enter}')
    await expect(await canvas.findByRole('status')).toHaveTextContent('Updated: Tomato soup')
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  }}><DialogFormExample /></Story
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

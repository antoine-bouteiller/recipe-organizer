<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import Button from '@/components/ui/actions/button/button.svelte'

  import DeleteDialog from './delete-dialog.svelte'

  import * as styles from './delete-dialog.stories.css'

  const { Story } = defineMeta({ component: DeleteDialog, title: 'Overlays/DeleteDialog' })
</script>

<script lang="ts">
  let deleted = $state(false)
  let completeDelete = $state<(() => void) | undefined>()
  const handleDelete = async () => {
    await Promise.resolve()
    deleted = true
  }
  const pendingDelete = () =>
    new Promise<void>((resolve) => {
      completeDelete = resolve
    })
</script>

<Story
  name="Confirmation"
  asChild
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = await canvas.findByRole('button', { name: 'Delete Tomato soup' })
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('button', { name: 'Supprimer' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent('Tomato soup was deleted.')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  }}
>
  <div class={styles.container}>
    <DeleteDialog
      deleteButtonLabel="Delete recipe"
      description="This removes Tomato soup from your saved recipes. This action cannot be undone."
      onDelete={handleDelete}
      title="Delete Tomato soup?"
    >
      {#snippet renderTrigger({ children, ...props })}<Button {...props} aria-label="Delete Tomato soup" variant="destructive"
          >{@render children()}</Button
        >{/snippet}
    </DeleteDialog>
    {#if deleted}<p role="status">Tomato soup was deleted.</p>{/if}
  </div>
</Story>

<Story
  name="Pending Cancellation"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Delete pending recipe' })
    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog', { name: 'Delete pending recipe?' })
    const popup = within(dialog)
    await userEvent.click(popup.getByRole('button', { name: 'Supprimer' }))
    await expect(popup.getByRole('button', { name: /Supprimer/ })).toBeDisabled()
    await expect(popup.getByRole('button', { name: 'Annuler' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    const viewport = dialog.parentElement
    if (!viewport) {
      throw new Error('The dialog must have an outside-click viewport')
    }
    await userEvent.click(viewport)
    await expect(body.getByRole('dialog', { name: 'Delete pending recipe?' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Finish deletion' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  }}
>
  <DeleteDialog
    deleteButtonLabel="Delete pending recipe"
    description="Cancellation is disabled until deletion finishes."
    onDelete={pendingDelete}
    title="Delete pending recipe?"
  >
    {#snippet renderTrigger({ children, ...props })}<Button {...props} aria-label="Delete pending recipe">{@render children()}</Button>{/snippet}
  </DeleteDialog>
  <Button onclick={() => completeDelete?.()}>Finish deletion</Button>
</Story>

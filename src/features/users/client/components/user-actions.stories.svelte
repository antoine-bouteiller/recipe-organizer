<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import Example from './user-actions.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Users/UserActions' })
</script>

<Story name="Approve" asChild><Example /></Story>
<Story name="Block" asChild><Example blocked /></Story>
<Story
  name="VC-4 Approval Pending Thrown Recovery"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alertSpy = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      const approve = canvas.getByRole('button', { name: "Approuver l'utilisateur" })
      await userEvent.dblClick(approve)
      await expect(approve).toBeDisabled()
      await expect(canvas.getByRole('status')).toHaveTextContent('Actions: 1')
      await userEvent.click(canvas.getByRole('button', { name: "Terminer l'action" }))
      await waitFor(() => expect(approve).toBeEnabled())
      await expect(alertSpy).toHaveBeenCalledTimes(1)
      await expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Erreur lors de l'approbation de l'utilisateur"))
    } finally {
      alertSpy.mockRestore()
    }
  }}><Example failure /></Story
>
<Story
  name="VC-4 Block Confirmation Pending Thrown Recovery"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const alertSpy = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      await userEvent.click(canvas.getByRole('button', { name: "Bloquer l'utilisateur" }))
      await expect(await body.findByText("Êtes-vous sûr de vouloir bloquer l'utilisateur alice@example.com ?")).toBeVisible()
      await userEvent.click(body.getByRole('button', { name: 'Bloquer' }))
      await expect(body.getByRole('button', { name: 'Annuler' })).toBeDisabled()
      await userEvent.keyboard('{Escape}{Enter}')
      await expect(canvas.getByRole('status')).toHaveTextContent('Actions: 1')
      await userEvent.click(body.getByRole('button', { name: "Terminer l'action" }))
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
      await expect(alertSpy).toHaveBeenCalledTimes(1)
      await expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Erreur lors du blocage de l'utilisateur"))
    } finally {
      alertSpy.mockRestore()
    }
  }}><Example blocked failure /></Story
>

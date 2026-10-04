<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import Example from './users-management.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Users/UsersManagement' })
  const failurePlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const alertSpy = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un utilisateur' }))
      const email = await body.findByRole('textbox', { name: 'Email' })
      await userEvent.type(email, 'brouillon@example.com{Enter}')
      await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1))
      await expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Erreur lors de la création de l'utilisateur"))
      await expect(email).toHaveValue('brouillon@example.com')
      await expect(email).toBeEnabled()
      await userEvent.type(email, 'x')
      await expect(alertSpy).toHaveBeenCalledTimes(1)
      await userEvent.click(body.getByRole('button', { name: 'Annuler' }))
    } finally {
      alertSpy.mockRestore()
    }
  }
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-3 VC-4 Invalid Draft Pending And Create Reset"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un utilisateur' }))
    const email = await body.findByRole('textbox', { name: 'Email' })
    await userEvent.type(email, 'invalide')
    await userEvent.click(body.getByRole('button', { name: 'Rôle Utilisateur' }))
    await userEvent.click(await body.findByRole('button', { name: 'Administrateur' }))
    await userEvent.type(email, '{Enter}')
    await expect(await body.findByRole('alert')).toHaveTextContent('Adresse e-mail invalide')
    await expect(email).toHaveValue('invalide')
    await expect(body.getByRole('button', { name: 'Rôle Administrateur' })).toBeVisible()
    await userEvent.clear(email)
    await userEvent.type(email, 'nouveau@example.com{Enter}')
    await waitFor(() => expect(email).toBeDisabled())
    await userEvent.keyboard('{Enter}{Enter}')
    await expect(canvas.getByRole('status')).toHaveTextContent('Requêtes: 2')
    await userEvent.click(body.getByRole('button', { name: 'Terminer la création' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un utilisateur' }))
    await expect(await body.findByRole('textbox', { name: 'Email' })).toHaveValue('')
    await expect(body.getByRole('button', { name: 'Rôle Utilisateur' })).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: 'Annuler' }))
  }}><Example /></Story
>
<Story name="VC-4 Expected Failure Alerts Once Retains Draft" asChild tags={['!dev']} play={failurePlay}><Example failure="expected" /></Story>
<Story name="VC-4 Thrown Failure Clears Pending Retains Draft" asChild tags={['!dev']} play={failurePlay}><Example failure="thrown" /></Story>

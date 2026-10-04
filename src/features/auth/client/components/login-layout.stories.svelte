<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import Example from './login-layout.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Auth/LoginLayout' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-4 Sign In Pending Failure Recovery"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alertSpy = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      await expect(canvas.getByText("Votre compte est en attente d'approbation par un administrateur")).toBeVisible()
      await expect(canvas.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute('href', '/')
      const signIn = canvas.getByRole('button', { name: 'Google Connexion avec Google' })
      await userEvent.dblClick(signIn)
      await expect(signIn).toBeDisabled()
      await expect(canvas.getByRole('status')).toHaveTextContent('Connexions: 1')
      await userEvent.click(canvas.getByRole('button', { name: 'Échouer la connexion' }))
      await waitFor(() => expect(signIn).toBeEnabled())
      await expect(alertSpy).toHaveBeenCalledTimes(1)
      await expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur lors de la connexion avec Google'))
      await userEvent.click(signIn)
      await expect(canvas.getByRole('status')).toHaveTextContent('Connexions: 2')
      await userEvent.click(canvas.getByRole('button', { name: 'Échouer la connexion' }))
      await waitFor(() => expect(signIn).toBeEnabled())
    } finally {
      alertSpy.mockRestore()
    }
  }}><Example /></Story
>

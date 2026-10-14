<script module lang="ts">
  import { json } from '@storybook-helpers/stub-fetch'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import Example from './recipe-management-actions.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/RecipeManagementActions' })
  const openDelete = async (canvasElement: HTMLElement) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Gérer la recette' }))
    await userEvent.click(within(document.body).getByRole('button', { name: 'Supprimer la recette' }))
    return within(within(document.body).getByRole('dialog', { name: 'Supprimer la recette' }))
  }
  const stubNavigation = () => {
    const entry = navigation.currentEntry
    return spyOn(navigation, 'navigate').mockImplementation(
      () => ({ committed: Promise.resolve(entry), finished: Promise.resolve(entry) }) as NavigationResult
    )
  }
  // Deletion targets the current recipe, then replaces the history entry so Back cannot reopen it.
  // Pending disables repeated submission, while failures alert once and resolve.
  let complete: () => void = () => undefined
  const successRespond = fn(
    (_request: Request) =>
      new Promise<Response>((resolve) => {
        complete = () => resolve(new Response(null, { status: 204 }))
      })
  )
  const success = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const navigate = stubNavigation()
    try {
      await userEvent.click(within(canvasElement).getByRole('button', { name: 'Afficher une autre recette' }))
      const dialog = await openDelete(canvasElement)
      await expect(dialog.getByText('Êtes-vous sûr de vouloir supprimer la recette Gâteau?')).toBeVisible()
      const submit = dialog.getByRole('button', { name: /^Supprimer$/ })
      await userEvent.click(submit)
      await waitFor(() => expect(successRespond).toHaveBeenCalledTimes(1))
      const [request] = successRespond.mock.calls[0] ?? []
      await expect(request?.method).toBe('DELETE')
      await expect(new URL(request?.url ?? '').pathname).toBe('/api/recipes/12')
      await expect(submit).toBeDisabled()
      await expect(dialog.getByRole('button', { name: 'Annuler' })).toBeDisabled()
      await userEvent.keyboard('{Enter}{Enter}')
      await expect(successRespond).toHaveBeenCalledTimes(1)
      complete()
      await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
      await expect(navigate).toHaveBeenCalledWith('/', { history: 'replace' })
    } finally {
      navigate.mockRestore()
    }
  }
  const failureRespond = fn((_request: Request) => Promise.reject(new Error('Connexion interrompue')))
  const failure = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const alert = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    const navigate = stubNavigation()
    try {
      const dialog = await openDelete(canvasElement)
      await userEvent.click(dialog.getByRole('button', { name: /^Supprimer$/ }))
      await waitFor(() => expect(alert).toHaveBeenCalledTimes(1))
      await expect(failureRespond).toHaveBeenCalledTimes(1)
      await expect(alert).toHaveBeenCalledWith(
        expect.stringMatching(/^Une erreur est survenue lors de la suppression de la recette\n\n.*Connexion interrompue/su)
      )
      await expect(navigate).not.toHaveBeenCalled()
    } finally {
      alert.mockRestore()
      navigate.mockRestore()
    }
  }
  const conflictRespond = fn((_request: Request) => Promise.resolve(json({ error: 'Cette recette est liée à une autre recette' }, 409)))
  const conflict = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const alert = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    const navigate = stubNavigation()
    try {
      const dialog = await openDelete(canvasElement)
      await userEvent.click(dialog.getByRole('button', { name: /^Supprimer$/ }))
      await waitFor(() => expect(alert).toHaveBeenCalledTimes(1))
      await expect(conflictRespond).toHaveBeenCalledTimes(1)
      await expect(alert).toHaveBeenCalledWith(
        'Une erreur est survenue lors de la suppression de la recette\n\nCette recette est liée à une autre recette'
      )
      await expect(navigate).not.toHaveBeenCalled()
    } finally {
      alert.mockRestore()
      navigate.mockRestore()
    }
  }
</script>

<Story name="Deletion replaces current recipe (VC-4)" args={{ respond: successRespond }} play={success} />
<Story name="Deletion catches rejection (VC-4)" args={{ respond: failureRespond }} play={failure} />

<Story name="Deletion reports conflict (VC-4)" args={{ respond: conflictRespond }} play={conflict} />

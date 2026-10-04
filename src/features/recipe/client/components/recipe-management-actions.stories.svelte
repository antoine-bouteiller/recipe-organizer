<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import Example from './recipe-management-actions.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/RecipeManagementActions' })
  const openDelete = async (canvasElement: HTMLElement) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Gérer la recette' }))
    await userEvent.click(within(document.body).getByRole('button', { name: 'Supprimer la recette' }))
    return within(within(document.body).getByRole('dialog', { name: 'Supprimer la recette' }))
  }
  // Migration CT-4/VC-4: redirected deletion targets current props with replacement;
  // Pending disables repeated submission, while unexpected failures alert once and resolve.
  let complete: () => void = () => undefined
  const successVisit = fn(
    () =>
      new Promise<void>((resolve) => {
        complete = resolve
      })
  )
  const success = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Afficher une autre recette' }))
    const dialog = await openDelete(canvasElement)
    await expect(dialog.getByText('Êtes-vous sûr de vouloir supprimer la recette Gâteau?')).toBeVisible()
    const submit = dialog.getByRole('button', { name: /^Supprimer$/ })
    await userEvent.click(submit)
    await expect(successVisit).toHaveBeenCalledTimes(1)
    await expect(successVisit).toHaveBeenCalledWith('/recipe/12', { method: 'POST', replace: true })
    await expect(submit).toBeDisabled()
    await expect(dialog.getByRole('button', { name: 'Annuler' })).toBeDisabled()
    await userEvent.keyboard('{Enter}{Enter}')
    await expect(successVisit).toHaveBeenCalledTimes(1)
    complete()
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
  }
  const failureVisit = fn().mockResolvedValue(undefined)
  const failure = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const alert = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      const dialog = await openDelete(canvasElement)
      await userEvent.click(dialog.getByRole('button', { name: /^Supprimer$/ }))
      await expect(failureVisit).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(alert).toHaveBeenCalledTimes(1))
      await expect(alert).toHaveBeenCalledWith('Une erreur est survenue lors de la suppression de la recette\n\nConnexion interrompue')
    } finally {
      alert.mockRestore()
    }
  }
  const conflictVisit = fn().mockResolvedValue(undefined)
  // CT-4: expected graph conflicts have their own result path through submitAction.
  const conflict = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const alert = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      const dialog = await openDelete(canvasElement)
      await userEvent.click(dialog.getByRole('button', { name: /^Supprimer$/ }))
      await expect(conflictVisit).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(alert).toHaveBeenCalledTimes(1))
      await expect(alert).toHaveBeenCalledWith(
        'Une erreur est survenue lors de la suppression de la recette\n\nCette recette est liée à une autre recette'
      )
    } finally {
      alert.mockRestore()
    }
  }
</script>

<Story name="Deletion replaces current recipe (VC-4)" args={{ visit: successVisit }} play={success} />
<Story name="Deletion catches rejection (VC-4)" args={{ failure: 'thrown', visit: failureVisit }} play={failure} />

<Story name="Deletion reports conflict (VC-4)" args={{ failure: 'conflict', visit: conflictVisit }} play={conflict} />

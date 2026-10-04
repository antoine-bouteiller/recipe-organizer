<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'

  import Example from './add-ingredient.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Features/Ingredients/AddIngredient' })
</script>

<Story name="Default" asChild><Example /></Story>
<Story
  name="VC-3 VC-4 API Draft Failure Pending And Refresh"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    let resolveRequest: ((response: Response) => void) | undefined
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = resolve
        })
    )
    const alertSpy = spyOn(globalThis, 'alert').mockImplementation(() => undefined)
    try {
      await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un ingrédient' }))
      const name = await body.findByRole('textbox', { name: "Nom de l'ingrédient" })
      await expect(name).toHaveValue('Tomate')
      await userEvent.clear(name)
      await userEvent.type(name, 'Courgette{Enter}')
      await waitFor(() => expect(name).toBeDisabled())
      await userEvent.keyboard('{Enter}{Enter}')
      await expect(fetchSpy).toHaveBeenCalledTimes(1)
      resolveRequest?.(
        new Response(JSON.stringify({ error: 'Catalogue indisponible' }), { status: 409, headers: { 'Content-Type': 'application/json' } })
      )
      await waitFor(() => expect(name).toBeEnabled())
      await expect(alertSpy).toHaveBeenCalledTimes(1)
      await expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Erreur lors de la création de l'ingrédient Courgette"))
      await expect(name).toHaveValue('Courgette')
      await expect(canvas.getByRole('status')).toHaveTextContent('Actualisations: 0')
      await userEvent.type(name, '{Enter}')
      await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))
      resolveRequest?.(new Response(JSON.stringify({ id: 2 }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
      await expect(canvas.getByRole('status')).toHaveTextContent('Actualisations: 1')
      await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un ingrédient' }))
      await expect(await body.findByRole('textbox', { name: "Nom de l'ingrédient" })).toHaveValue('Tomate')
      await userEvent.click(body.getByRole('button', { name: 'Ingrédient parent Aucune' }))
      await userEvent.click(await body.findByRole('button', { name: 'Courgette' }))
      await expect(body.getByRole('button', { name: 'Ingrédient parent Courgette' })).toBeVisible()
      await userEvent.click(body.getByRole('button', { name: 'Annuler' }))
    } finally {
      fetchSpy.mockRestore()
      alertSpy.mockRestore()
    }
  }}><Example /></Story
>

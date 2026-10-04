<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import Example from './recipe-form.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/RecipeForm' })
  // Migration VC-3/VC-4, editor VC-8: immutable ingredient arrays, dotted errors,
  // Retained media, catalogue refresh without discarding edit drafts, and pending controls.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Nom de la recette' }))
    await userEvent.type(canvas.getByRole('textbox', { name: 'Nom de la recette' }), 'Gâteau révisé')
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Portions' }))
    await userEvent.type(canvas.getByRole('textbox', { name: 'Portions' }), '6')
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un groupe' }))
    await userEvent.type(canvas.getByRole('textbox', { name: 'Nom du groupe' }), 'Garniture')
    await userEvent.click(canvas.getAllByRole('button', { name: 'Ajouter un ingrédient' }).at(1) as HTMLElement)
    await expect(canvas.getByText('Quantité requise')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Rafraîchir les ingrédients' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Sélectionner un ingrédient' }))
    await userEvent.click(within(document.body).getByRole('button', { name: 'Sel nouveau' }))
    await userEvent.type(canvas.getAllByPlaceholderText('Quantité').at(1) as HTMLElement, '2,5')
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter une sous-recette' }))
    await userEvent.click(canvas.getByRole('button', { name: /^Sélectionner une sous-recette$/ }))
    await userEvent.click(within(document.body).getByRole('button', { name: 'Sauce tomate' }))
    await userEvent.clear(canvas.getByPlaceholderText('Ratio'))
    await userEvent.type(canvas.getByPlaceholderText('Ratio'), '0,5')
    const saved = JSON.parse(canvas.getByLabelText('Recette enregistrée').textContent ?? '{}')
    await expect(saved.name).toBe('Gâteau révisé')
    await expect(saved.servings).toBe(6)
    await expect(saved.ingredientGroups[0].ingredients[0]).toMatchObject({ id: 1, quantity: 100, unitSlug: 'g' })
    await expect(saved.ingredientGroups[1]).toMatchObject({ groupName: 'Garniture', ingredients: [{ id: 2, quantity: 2.5 }] })
    await expect(saved.linkedRecipes).toMatchObject([{ id: 11, ratio: 0.5 }])
    await expect(saved.image).toEqual({ id: 'retained-image', url: '/magimix/expert.png' })
    await expect(saved.video).toEqual({ id: 'retained-video', url: '/recipe.mp4' })
    await userEvent.click(canvas.getByRole('button', { name: 'Basculer en attente' }))
    await expect(canvas.getByRole('textbox', { name: 'Nom de la recette' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Ajouter un groupe' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Ajouter une sous-recette' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Basculer en attente' }))
    await userEvent.click(canvas.getAllByRole('button', { name: "Supprimer l'ingrédient" }).at(1) as HTMLElement)
    await expect(JSON.parse(canvas.getByLabelText('Recette enregistrée').textContent ?? '{}').ingredientGroups[1].ingredients).toEqual([])
    await userEvent.click(canvas.getByRole('button', { name: "Supprimer le groupe d'ingrédients" }))
    await userEvent.click(canvas.getByRole('button', { name: 'Supprimer la sous-recette liée' }))
    const remaining = JSON.parse(canvas.getByLabelText('Recette enregistrée').textContent ?? '{}')
    await expect(remaining.ingredientGroups).toHaveLength(1)
    await expect(remaining.ingredientGroups[0].ingredients[0]).toMatchObject({ id: 1, quantity: 100 })
    await expect(remaining.linkedRecipes).toEqual([])
  }
</script>

<Story name="Edit arrays and refresh (VC-3 VC-4)" {play} />

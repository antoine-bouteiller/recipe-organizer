<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, userEvent, within } from 'storybook/test'

  import { setRecipesQuantities } from '@/stores/recipe-quantities.store.svelte'
  import { removeFromShoppingList } from '@/stores/shopping-list.store.svelte'

  import Example from './quantity-controls.example.svelte'

  const { Story } = defineMeta({ component: Example, title: 'Recipe/QuantityControls' })
  // Migration VC-5, recipe umbrella VC-3: quantities and membership remain device-only,
  // Track changed recipe props, and preserve each recipe's independent serving override.
  const play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    removeFromShoppingList(91_001)
    removeFromShoppingList(91_002)
    setRecipesQuantities(91_001, 4)
    setRecipesQuantities(91_002, 2)
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter à la liste' }))
    await expect(canvas.getByText('4 couverts')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter un couvert' }))
    await expect(canvas.getByText('5 couverts')).toBeVisible()
    await expect(JSON.parse(localStorage.getItem('recipe-quantities') ?? '{}')[91_001]).toBe(5)
    await userEvent.click(canvas.getByRole('button', { name: 'Changer de recette' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Ajouter à la liste' }))
    await expect(canvas.getByText('2 couverts')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Retirer un couvert' }))
    await expect(canvas.getByText('1 couverts')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Retirer un couvert' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Changer de recette' }))
    await expect(canvas.getByText('5 couverts')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Retirer de la liste' }))
    await expect(canvas.getByRole('button', { name: 'Ajouter à la liste' })).toBeVisible()
    await expect(JSON.parse(localStorage.getItem('recipe-quantities') ?? '{}')[91_001]).toBe(5)
    await expect(JSON.parse(localStorage.getItem('shopping-list') ?? '[]')).not.toContain(91_001)
    removeFromShoppingList(91_002)
    setRecipesQuantities(91_001, 4)
    setRecipesQuantities(91_002, 2)
  }
</script>

<Story name="Device-only quantities (VC-5)" {play} />

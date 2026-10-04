<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test'
  import { tick } from 'svelte'

  import { setRecipesQuantities } from '@/stores/recipe-quantities.store.svelte'
  import { addToShoppingList, resetShoppingList } from '@/stores/shopping-list.store.svelte'

  import { loadRecipesByIds } from '../api/get-recipe-by-ids'
  import type { ShoppingListRecipe } from '../utils/aggregate-shopping-list'
  import ShoppingList from './shopping-list.svelte'

  const { Story } = defineMeta({ component: ShoppingList, parameters: { layout: 'padded' }, title: 'Shopping List/ShoppingList' })
  const select = (id: number) => {
    resetShoppingList()
    addToShoppingList(id)
  }
  const recipe = (id: number, name: string): ShoppingListRecipe => ({
    id,
    ingredients: [
      {
        category: 'vegetables',
        countWeightG: null,
        densityGPerMl: null,
        id,
        name,
        parentId: null,
        preferredUnitSlug: 'g',
        quantity: 100,
        unitSlug: 'g',
      },
    ],
    servings: 4,
  })
  const response = (value: ShoppingListRecipe[]) => Response.json(value)
</script>

<Story
  name="VC-5 Latest Selection Wins"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fetched = spyOn(globalThis, 'fetch')
    let resolveOld!: (value: Response) => void
    let resolveNew!: (value: Response) => void
    const oldRequest = new Promise<Response>((resolve) => (resolveOld = resolve))
    const newRequest = new Promise<Response>((resolve) => (resolveNew = resolve))
    fetched.mockReturnValueOnce(oldRequest).mockReturnValueOnce(newRequest)
    try {
      resetShoppingList()
      await userEvent.click(canvas.getByRole('button', { name: 'Choisir les carottes' }))
      await waitFor(() => expect(fetched).toHaveBeenCalledTimes(1))
      await userEvent.click(canvas.getByRole('button', { name: 'Choisir les tomates' }))
      await waitFor(() => expect(fetched).toHaveBeenCalledTimes(2))
      resolveNew(response([recipe(61002, 'Tomates')]))
      await expect(await canvas.findByRole('button', { name: 'Tomates 100 g' })).toBeVisible()
      resolveOld(response([recipe(61001, 'Carottes')]))
      // Wait for the real transport to settle, then inspect the public UI, not the request callback.
      await loadRecipesByIds([61001])
      await tick()
      await expect(canvas.getByRole('button', { name: 'Tomates 100 g' })).toBeVisible()
      await expect(canvas.queryByRole('button', { name: /Carottes 100/ })).not.toBeInTheDocument()
    } finally {
      resolveOld(response([]))
      resolveNew(response([]))
      resetShoppingList()
      fetched.mockRestore()
    }
  }}
>
  <button onclick={() => select(61001)}>Choisir les carottes</button>
  <button onclick={() => select(61002)}>Choisir les tomates</button>
  <ShoppingList />
</Story>

<Story
  name="VC-5 Pending Read Uses Latest Serving Override And Reset"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fetched = spyOn(globalThis, 'fetch')
    let resolveRequest!: (value: Response) => void
    fetched.mockReturnValueOnce(new Promise<Response>((resolve) => (resolveRequest = resolve)))
    try {
      resetShoppingList()
      await userEvent.click(canvas.getByRole('button', { name: 'Choisir la recette' }))
      await waitFor(() => expect(fetched).toHaveBeenCalledTimes(1))
      await userEvent.click(canvas.getByRole('button', { name: 'Préparer huit portions' }))
      resolveRequest(response([recipe(61003, 'Courgettes')]))
      const row = await canvas.findByRole('button', { name: 'Courgettes 200 g' })
      await userEvent.click(row)
      await expect(row).toHaveAttribute('aria-pressed', 'true')
      await userEvent.click(canvas.getByRole('button', { name: 'Vider la liste' }))
      await expect(await canvas.findByText('Votre liste de courses est vide')).toBeVisible()
      await expect(JSON.parse(localStorage.getItem('recipe-quantities') ?? 'null')[61003]).toBe(8)
    } finally {
      resolveRequest(response([]))
      resetShoppingList()
      fetched.mockRestore()
    }
  }}
>
  <button onclick={() => select(61003)}>Choisir la recette</button>
  <button onclick={() => setRecipesQuantities(61003, 8)}>Préparer huit portions</button>
  <button onclick={resetShoppingList}>Vider la liste</button>
  <ShoppingList />
</Story>

<Story
  name="VC-5 Failed Read Recovers With Retry"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fetched = spyOn(globalThis, 'fetch')
    const unavailable = () => Response.json({ error: 'unavailable' }, { status: 503 })
    // The real Void transport retries a failed GET once before the feature presents recovery.
    fetched
      .mockResolvedValueOnce(unavailable())
      .mockResolvedValueOnce(unavailable())
      .mockResolvedValueOnce(response([recipe(61004, 'Aubergines')]))
    try {
      resetShoppingList()
      await userEvent.click(canvas.getByRole('button', { name: 'Choisir la recette' }))
      await expect(await canvas.findByRole('alert')).toHaveTextContent('Impossible de charger votre liste de courses. Veuillez réessayer.')
      await userEvent.click(canvas.getByRole('button', { name: 'Réessayer' }))
      await expect(await canvas.findByRole('button', { name: 'Aubergines 100 g' })).toBeVisible()
      await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    } finally {
      resetShoppingList()
      fetched.mockRestore()
    }
  }}
>
  <button onclick={() => select(61004)}>Choisir la recette</button>
  <ShoppingList />
</Story>

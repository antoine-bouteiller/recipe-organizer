<script lang="ts">
  import { setContext } from 'svelte'
  import { VoidActionError } from 'void/pages-client'
  import type { VoidRouter } from 'void/pages-client'

  import RecipeManagementActions from './recipe-management-actions.svelte'

  const { visit, failure }: { visit: VoidRouter['visit']; failure?: 'thrown' | 'conflict' } = $props()
  const url = new URL('http://localhost/recipe/11')
  setContext<VoidRouter>('__void_router', {
    _hoverDelay: 75,
    flush: () => undefined,
    flushAll: () => undefined,
    params: { id: '11' },
    path: url.pathname,
    prefetch: async () => undefined,
    query: url.searchParams,
    refresh: async () => undefined,
    url,
    visit: async (destination, options) => {
      const result = visit(destination, options)
      if (failure === 'thrown') {
        throw new Error('Connexion interrompue')
      }
      if (failure === 'conflict') {
        throw new VoidActionError({
          body: { error: 'Cette recette est liée à une autre recette' },
          status: 409,
          statusText: 'Conflict',
          url: '/recipe/11',
        })
      }
      return result
    },
  })
  let recipeId = $state(11)
</script>

<button
  type="button"
  onclick={() => {
    recipeId = 12
  }}>Afficher une autre recette</button
>
<RecipeManagementActions {recipeId} recipeName={recipeId === 11 ? 'Sauce tomate' : 'Gâteau'} />

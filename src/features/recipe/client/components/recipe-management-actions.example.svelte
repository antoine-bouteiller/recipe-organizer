<script lang="ts">
  import { stubFetch } from '@storybook-helpers/stub-fetch'

  import RecipeManagementActions from './recipe-management-actions.svelte'

  const { respond }: { respond: (request: Request) => Promise<Response> } = $props()
  stubFetch((request) => respond(request))
  let recipeId = $state(11)
</script>

<button
  type="button"
  onclick={() => {
    recipeId = 12
  }}>Afficher une autre recette</button
>
<RecipeManagementActions {recipeId} recipeName={recipeId === 11 ? 'Sauce tomate' : 'Gâteau'} />

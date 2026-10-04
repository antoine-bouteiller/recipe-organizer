<script lang="ts">
  import { useRouter } from '@void/svelte'
  import { submitAction } from 'void/pages-client'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@/components/ui/data-display/icons'
  import DeleteDialog from '@/components/ui/overlays/delete-dialog/delete-dialog.svelte'
  import Popover from '@/components/ui/overlays/popover/popover.svelte'
  import { alertError } from '@/lib/client/alert-error'
  import { getErrorMessage } from '@/lib/client/api-client'

  const { recipeId, recipeName }: { readonly recipeId: number; readonly recipeName: string } = $props()
  const router = useRouter()
  let pending = $state(false)
  const deleteRecipe = async () => {
    if (pending) {
      return
    }
    pending = true
    const message = 'Une erreur est survenue lors de la suppression de la recette'
    try {
      // The action redirects home; Back must not reopen the deleted recipe.
      const result = await submitAction(router, `/recipe/${recipeId}`, { method: 'POST', replace: true })
      if (!result.ok) {
        alertError(message, new Error(getErrorMessage(result.error.body)))
      }
    } catch (error) {
      // DeleteDialog awaits this callback without catching: never leak a rejected action.
      alertError(message, error)
    } finally {
      pending = false
    }
  }
</script>

<Popover>
  {#snippet renderTrigger(props)}<Button {...props} aria-label="Gérer la recette" size="icon" variant="ghost"
      ><DotsThreeVerticalIcon weight="bold" /></Button
    >{/snippet}
  <div class="recipe-details-management-actions">
    <Button align="start" asLink href={`/recipe/edit/${recipeId}`} variant="list-action" width="full"
      ><PencilSimpleIcon size="sm" />Modifier la recette</Button
    >
    <DeleteDialog
      deleteButtonLabel="Supprimer la recette"
      description={`Êtes-vous sûr de vouloir supprimer la recette ${recipeName}?`}
      onDelete={deleteRecipe}
      title="Supprimer la recette"
    >
      {#snippet renderTrigger({ children, ...props })}<Button {...props} disabled={pending} variant="destructive-ghost">{@render children()}</Button
        >{/snippet}
    </DeleteDialog>
  </div>
</Popover>

<style>
  .recipe-details-management-actions {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  @media screen and (min-width: 768px) {
    .recipe-details-management-actions {
      padding: 0px;
    }
  }
</style>

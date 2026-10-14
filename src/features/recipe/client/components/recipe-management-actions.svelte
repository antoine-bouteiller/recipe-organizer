<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@/components/ui/data-display/icons'
  import DeleteDialog from '@/components/ui/overlays/delete-dialog/delete-dialog.svelte'
  import Popover from '@/components/ui/overlays/popover/popover.svelte'
  import { deleteRecipeMutation } from '@/features/recipe/client/api/delete'
  import { alertError } from '@/lib/client/alert-error'
  import { router } from '@/lib/client/router/router.svelte'

  const { recipeId, recipeName }: { readonly recipeId: number; readonly recipeName: string } = $props()
  const mutation = createMutation(() => deleteRecipeMutation())
  const pending = $derived(mutation.isPending)
  const deleteRecipe = async () => {
    if (pending) {
      return
    }
    try {
      await mutation.mutateAsync(recipeId)
      // Back must not reopen the deleted recipe.
      await router.navigate('/', { replace: true })
    } catch (error) {
      // DeleteDialog awaits this callback without catching: never leak a rejected mutation.
      alertError('Une erreur est survenue lors de la suppression de la recette', error)
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

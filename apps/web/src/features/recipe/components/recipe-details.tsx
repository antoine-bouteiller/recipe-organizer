import { deleteRecipeOptions } from '@client/features/recipe/api/delete'
import { type Recipe } from '@client/features/recipe/api/get-one'
import { recipeNodes } from '@client/features/recipe/components/editor/extensions'
import { QuantityControls } from '@client/features/recipe/components/quantity-controls'
import { RecipeIngredientGroups } from '@client/features/recipe/components/recipe-section'
import { Badge } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { DeleteDialog } from '@recipe-organizer/design-system/delete-dialog'
import { Editor, EditorContent } from '@recipe-organizer/design-system/editor'
import { DotsThreeVerticalIcon } from '@recipe-organizer/design-system/icons/dots-three-vertical'
import { PencilSimpleIcon } from '@recipe-organizer/design-system/icons/pencil-simple'
import { Popover } from '@recipe-organizer/design-system/popover'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { SwipeTabs, SwipeTabsPanel, SwipeTabsPanels, TabsList, TabsTab } from '@recipe-organizer/design-system/tabs'
import { toastManager } from '@recipe-organizer/design-system/toast'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'

import * as styles from './recipe-details.css'

export const RecipeDetailsSkeleton = () => (
  <>
    <div className={styles.container}>
      <Skeleton preset="recipe-details-title" />
    </div>
    <div className={styles.skeletonDetails}>
      {incrementalArray({ length: 6 }).map((index) => (
        <Skeleton preset="recipe-details-text" key={index} />
      ))}
    </div>
  </>
)

export const RecipeManagementActions = ({ recipe }: { readonly recipe: Recipe }) => {
  const { mutateAsync: deleteRecipe } = useMutation(deleteRecipeOptions())
  const router = useRouter()

  const handleDelete = () =>
    deleteRecipe(
      { data: recipe.id },
      {
        onError: () =>
          toastManager.add({
            description: 'Une erreur est survenue lors de la suppression de la recette',
            type: 'error',
          }),
        onSuccess: () => {
          toastManager.add({
            title: 'Recette supprimée avec succès',
            type: 'success',
          })
          void router.navigate({ to: '/' })
        },
      }
    )

  return (
    <Popover
      trigger={
        <Button size="icon" variant="ghost">
          <DotsThreeVerticalIcon weight="bold" />
        </Button>
      }
    >
      <div className={styles.managementActions}>
        <Button
          align="start"
          render={<Link params={{ id: recipe.id.toString() }} to="/recipe/edit/$id" viewTransition />}
          variant="list-action"
          width="full"
        >
          <PencilSimpleIcon size="sm" />
          Modifier la recette
        </Button>
        <DeleteDialog
          deleteButtonLabel="Supprimer la recette"
          description={`Êtes-vous sûr de vouloir supprimer la recette ${recipe.name}?`}
          onDelete={handleDelete}
          title="Supprimer la recette"
          trigger={<Button variant="destructive-ghost" />}
        />
      </div>
    </Popover>
  )
}

export const RecipeDetailsContent = ({ recipe, recipeId }: { readonly recipe: Recipe; readonly recipeId: number }) => {
  const ingredientGroups = [
    ...recipe.ingredientGroups,
    ...recipe.linkedRecipes.map(({ linkedRecipe }) => ({ ...linkedRecipe.ingredientGroups[0], groupName: linkedRecipe.name, isDefault: false })),
  ]
  const metaTags = [
    recipe.isVegetarian && VEGETARIAN_LABEL,
    recipe.isMagimix && MAGIMIX_LABEL,
    ...recipe.meals.map((meal) => MEAL_LABELS[meal]),
    ...recipe.cuisineTypes.map((cuisineType) => CUISINE_TYPE_LABELS[cuisineType]),
  ].filter((tag) => tag !== false)

  return (
    <>
      <h1 className={styles.heading}>{recipe.name}</h1>
      {metaTags.length > 0 && (
        <div className={styles.metadataTags}>
          {metaTags.map((label) => (
            <Badge key={label} size="sm" variant="secondary">
              {label}
            </Badge>
          ))}
        </div>
      )}
      <div className={styles.quantityControls}>
        <QuantityControls recipeId={recipeId} servings={recipe.servings} />
      </div>
      <div className={styles.detailsContent}>
        <div className={styles.mobileTabs}>
          <SwipeTabs defaultTab="ingredients" tabs={['ingredients', 'preparation'] as const}>
            <TabsList>
              <TabsTab value="ingredients">Ingrédients</TabsTab>
              <TabsTab value="preparation">Préparation</TabsTab>
            </TabsList>
            <SwipeTabsPanels>
              <SwipeTabsPanel value="ingredients">
                <div className={styles.ingredientsPanel}>
                  <RecipeIngredientGroups
                    recipeId={recipe.id}
                    baseServings={recipe.servings}
                    ingredientGroups={ingredientGroups}
                    presentation="standalone"
                  />
                </div>
              </SwipeTabsPanel>
              <SwipeTabsPanel value="preparation">
                <div className={styles.instructionsPanel}>
                  <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                    <EditorContent width="reading" />
                  </Editor>
                </div>
              </SwipeTabsPanel>
            </SwipeTabsPanels>
          </SwipeTabs>
        </div>
        <div className={styles.desktopLayout}>
          <section className={styles.section}>
            <h2 className={styles.ingredientsHeading}>Ingrédients</h2>
            <RecipeIngredientGroups recipeId={recipeId} baseServings={recipe.servings} ingredientGroups={ingredientGroups} presentation="embedded" />
          </section>
          <section className={styles.instructionsSection}>
            <h2 className={styles.instructionsHeading}>Préparation</h2>
            <div className={styles.instructionsContent}>
              <Editor content={recipe.instructions} nodes={recipeNodes} readOnly>
                <EditorContent width="reading" />
              </Editor>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

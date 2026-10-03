import { useRouter } from '@void/react'
import type { ReactNode } from 'react'
import { submitAction } from 'void/pages-client'

import { Button } from '@/components/ui/actions/button/button'
import { Badge } from '@/components/ui/data-display/badge/badge'
import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@/components/ui/data-display/icons'
import { Tabs } from '@/components/ui/navigation/tabs/tabs'
import { DeleteDialog } from '@/components/ui/overlays/delete-dialog/delete-dialog'
import { Popover } from '@/components/ui/overlays/popover/popover'
import type { Recipe } from '@/features/recipe/client/api/get-one'
import type { RecipeIngredientGroupsProps } from '@/features/recipe/client/components/recipe-section'
import { RecipeStepGroups } from '@/features/recipe/client/components/steps/recipe-steps'
import type { SubrecipeInstructions } from '@/features/recipe/client/components/steps/recipe-steps'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, VEGETARIAN_LABEL } from '@/features/recipe/constants'
import { alertError } from '@/lib/client/alert-error'
import { getErrorMessage } from '@/lib/client/api-client'

import * as styles from './recipe-details.css'

export const RecipeManagementActions = ({ recipeId, recipeName }: { readonly recipeId: number; readonly recipeName: string }) => {
  const router = useRouter()
  // The action redirects home; replacing keeps Back from reopening the deleted recipe.
  const deleteRecipe = async () => {
    const result = await submitAction(router, `/recipe/${recipeId}`, { method: 'POST', replace: true })
    if (!result.ok) {
      alertError('Une erreur est survenue lors de la suppression de la recette', new Error(getErrorMessage(result.error.body)))
    }
  }

  return (
    <Popover
      renderTrigger={(props) => (
        <Button {...props} size="icon" variant="ghost">
          <DotsThreeVerticalIcon weight="bold" />
        </Button>
      )}
    >
      <div className={styles.managementActions}>
        <Button align="start" asLink href={`/recipe/edit/${recipeId}`} variant="list-action" width="full">
          <PencilSimpleIcon size="sm" />
          Modifier la recette
        </Button>
        <DeleteDialog
          deleteButtonLabel="Supprimer la recette"
          description={`Êtes-vous sûr de vouloir supprimer la recette ${recipeName}?`}
          onDelete={deleteRecipe}
          title="Supprimer la recette"
          renderTrigger={(props) => <Button {...props} variant="destructive-ghost" />}
        />
      </div>
    </Popover>
  )
}

export interface RecipeDetailsContentProps {
  readonly recipe: Recipe
  readonly subrecipes: readonly SubrecipeInstructions[]
  readonly quantityControls: ReactNode
  readonly renderIngredientGroups: (props: RecipeIngredientGroupsProps) => ReactNode
}

export const RecipeDetailsContent = ({ quantityControls, recipe, renderIngredientGroups, subrecipes }: RecipeDetailsContentProps) => {
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
      <div className={styles.quantityControls}>{quantityControls}</div>
      <div className={styles.detailsContent}>
        <div className={styles.mobileTabs}>
          <Tabs
            items={[
              {
                content: (
                  <div className={styles.ingredientsPanel}>
                    {renderIngredientGroups({ baseServings: recipe.servings, ingredientGroups, presentation: 'standalone', recipeId: recipe.id })}
                  </div>
                ),
                label: 'Ingrédients',
                value: 'ingredients',
              },
              {
                content: (
                  <div className={styles.instructionsPanel}>
                    <RecipeStepGroups stepGroups={recipe.stepGroups} subrecipes={subrecipes} />
                  </div>
                ),
                label: 'Préparation',
                value: 'preparation',
              },
            ]}
          />
        </div>
        <div className={styles.desktopLayout}>
          <section className={styles.section}>
            <h2 className={styles.ingredientsHeading}>Ingrédients</h2>
            {renderIngredientGroups({ baseServings: recipe.servings, ingredientGroups, presentation: 'embedded', recipeId: recipe.id })}
          </section>
          <section className={styles.instructionsSection}>
            <h2 className={styles.instructionsHeading}>Préparation</h2>
            <div className={styles.instructionsContent}>
              <RecipeStepGroups stepGroups={recipe.stepGroups} subrecipes={subrecipes} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

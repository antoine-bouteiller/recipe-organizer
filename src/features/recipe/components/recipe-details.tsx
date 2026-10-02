import type { Recipe } from '@client/features/recipe/api/get-one'
import type { RecipeIngredientGroupsProps } from '@client/features/recipe/components/recipe-section'
import { RecipeStepGroups } from '@client/features/recipe/components/steps/recipe-steps'
import type { SubrecipeInstructions } from '@client/features/recipe/components/steps/recipe-steps'
import { alertError } from '@client/lib/alert-error'
import { getErrorMessage } from '@client/lib/api-client'
import { Badge } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { DeleteDialog } from '@recipe-organizer/design-system/delete-dialog'
import { DotsThreeVerticalIcon, PencilSimpleIcon } from '@recipe-organizer/design-system/icons'
import { Popover } from '@recipe-organizer/design-system/popover'
import { Tabs } from '@recipe-organizer/design-system/tabs'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import type { ReactNode } from 'react'

import * as styles from './recipe-details.css'

// The details page is an island page without a client router, so it posts its delete action directly.
const deleteRecipe = async (recipeId: number) => {
  const response = await fetch(`/recipe/${recipeId}`, { method: 'POST' })
  if (!response.ok) {
    alertError(
      'Une erreur est survenue lors de la suppression de la recette',
      new Error(getErrorMessage(await response.json().catch(() => undefined)))
    )
    return
  }
  globalThis.location.assign('/')
}

export const RecipeManagementActions = ({ recipeId, recipeName }: { readonly recipeId: number; readonly recipeName: string }) => (
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
        onDelete={() => deleteRecipe(recipeId)}
        title="Supprimer la recette"
        renderTrigger={(props) => <Button {...props} variant="destructive-ghost" />}
      />
    </div>
  </Popover>
)

export interface RecipeDetailsContentProps {
  readonly recipe: Recipe
  readonly subrecipes: readonly SubrecipeInstructions[]
  /** Island pages pass the servings controls and scaled ingredient lists as islands. */
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

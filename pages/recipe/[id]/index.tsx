import { useShared } from '@void/react'

import { NotFound } from '@/components/not-found/not-found'
import { GoBackButton, ScreenLayout } from '@/components/screen-layout/screen-layout'
import { QuantityControls } from '@/features/recipe/client/components/quantity-controls'
import { RecipeDetailsContent, RecipeManagementActions } from '@/features/recipe/client/components/recipe-details'
import { RecipeIngredientGroups } from '@/features/recipe/client/components/recipe-section'

import type { Props } from './index.server'

export default function RecipePage({ recipe, subrecipes }: Props) {
  const { authUser } = useShared()

  if (!recipe) {
    return <NotFound />
  }

  return (
    <ScreenLayout
      backButton={<GoBackButton />}
      backgroundImage={recipe.image}
      headerEndItem={authUser && <RecipeManagementActions recipeId={recipe.id} recipeName={recipe.name} />}
      title={recipe.name}
    >
      <RecipeDetailsContent
        quantityControls={<QuantityControls recipeId={recipe.id} servings={recipe.servings} />}
        recipe={recipe}
        renderIngredientGroups={(props) => <RecipeIngredientGroups {...props} />}
        subrecipes={subrecipes}
      />
    </ScreenLayout>
  )
}

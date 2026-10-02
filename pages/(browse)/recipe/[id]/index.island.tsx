import { useShared } from '@void/react'

import { NotFound } from '@/components/not-found/not-found'
import { ScreenLayout } from '@/components/screen-layout/screen-layout'
import { RecipeDetailsContent } from '@/features/recipe/client/components/recipe-details'

import GoBack from './_go-back' with { island: 'load' }
import IngredientGroups from './_ingredient-groups' with { island: 'load' }
import QuantityControls from './_quantity-controls' with { island: 'load' }
import RecipeActions from './_recipe-actions' with { island: 'idle' }
import type { Props } from './index.server'

export default function RecipePage({ recipe, subrecipes }: Props) {
  const { authUser } = useShared()

  if (!recipe) {
    return <NotFound />
  }

  return (
    <ScreenLayout
      backButton={<GoBack />}
      backgroundImage={recipe.image}
      headerEndItem={authUser && <RecipeActions recipeId={recipe.id} recipeName={recipe.name} />}
      title={recipe.name}
    >
      <RecipeDetailsContent
        quantityControls={<QuantityControls recipeId={recipe.id} servings={recipe.servings} />}
        recipe={recipe}
        renderIngredientGroups={(props) => <IngredientGroups {...props} />}
        subrecipes={subrecipes}
      />
    </ScreenLayout>
  )
}

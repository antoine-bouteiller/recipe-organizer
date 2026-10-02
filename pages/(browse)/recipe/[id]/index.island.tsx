import { RecipeDetailsContent } from '@client/features/recipe/components/recipe-details'
import { NotFound } from '@recipe-organizer/design-system/not-found'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { useShared } from '@void/react'

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

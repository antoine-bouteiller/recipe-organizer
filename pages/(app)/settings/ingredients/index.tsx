import { IngredientsManagement } from '@client/features/ingredients/components/ingredients-management'
import { IngredientCatalogProvider } from '@client/features/ingredients/contexts/ingredient-catalog-context'
import { GoBackButton, ScreenLayout } from '@recipe-organizer/design-system/screen-layout'

import type { Props } from './index.server'

export default function IngredientsPage({ ingredients, isAdmin }: Props) {
  return (
    <ScreenLayout title="Ingrédients" backButton={<GoBackButton />}>
      <IngredientCatalogProvider ingredients={ingredients}>
        <IngredientsManagement isAdmin={isAdmin} />
      </IngredientCatalogProvider>
    </ScreenLayout>
  )
}

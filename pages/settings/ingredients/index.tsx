import { GoBackButton, ScreenLayout } from '@/components/screen-layout/screen-layout'
import { IngredientsManagement } from '@/features/ingredients/client/components/ingredients-management'
import { IngredientCatalogProvider } from '@/features/ingredients/client/contexts/ingredient-catalog-context'

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

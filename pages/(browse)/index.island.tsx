import { mobileMenuItems } from '@client/components/navigation/constants'
import { RecipeListContent } from '@client/features/recipe/components/recipe-list'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { useShared } from '@void/react'

import QuantityControls from './_quantity-controls' with { island: 'load' }
import type { Props } from './index.server'

export default function RecipeListPage({ recipes }: Props) {
  const { authUser } = useShared()

  return (
    <ScreenLayout title="Recettes" footer={<TabBar currentPath="/" items={mobileMenuItems} />}>
      <RecipeListContent
        canCreate={Boolean(authUser)}
        recipes={recipes}
        renderCardAction={(recipe) => <QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />}
      />
    </ScreenLayout>
  )
}

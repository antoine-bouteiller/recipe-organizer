import { useShared } from '@void/react'

import { mobileMenuItems } from '@/components/navigation/constants'
import { TabBar } from '@/components/navigation/tabbar'
import { ScreenLayout } from '@/components/screen-layout/screen-layout'
import { RecipeListContent } from '@/features/recipe/client/components/recipe-list'

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

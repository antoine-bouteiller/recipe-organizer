import { mobileMenuItems } from '@/components/navigation/constants'
import { ScreenLayout } from '@/design-system/ui/layout/screen-layout/screen-layout'
import { TabBar } from '@/design-system/ui/navigation/tabbar/tabbar'

import RecipeSearch from './_recipe-search' with { island: 'load' }
import type { Props } from './index.server'

export default function SearchPage({ recipes }: Props) {
  return (
    <ScreenLayout title="Rechercher" footer={<TabBar currentPath="/search" items={mobileMenuItems} />}>
      <RecipeSearch recipes={recipes} />
    </ScreenLayout>
  )
}

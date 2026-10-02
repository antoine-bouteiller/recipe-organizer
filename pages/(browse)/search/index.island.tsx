import { mobileMenuItems } from '@/components/navigation/constants'
import { TabBar } from '@/components/navigation/tabbar'
import { ScreenLayout } from '@/components/screen-layout/screen-layout'

import RecipeSearch from './_recipe-search' with { island: 'load' }
import type { Props } from './index.server'

export default function SearchPage({ recipes }: Props) {
  return (
    <ScreenLayout title="Rechercher" footer={<TabBar currentPath="/search" items={mobileMenuItems} />}>
      <RecipeSearch recipes={recipes} />
    </ScreenLayout>
  )
}

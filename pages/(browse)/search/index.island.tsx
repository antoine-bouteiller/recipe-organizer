import { mobileMenuItems } from '@client/components/navigation/constants'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'

import RecipeSearch from './_recipe-search' with { island: 'load' }
import type { Props } from './index.server'

export default function SearchPage({ recipes }: Props) {
  return (
    <ScreenLayout title="Rechercher" footer={<TabBar currentPath="/search" items={mobileMenuItems} />}>
      <RecipeSearch recipes={recipes} />
    </ScreenLayout>
  )
}

import { ScreenLayout as ScreenLayoutView } from '@recipe-organizer/design-system/screen-layout'
import { useRouter } from '@tanstack/react-router'
import { type ComponentProps } from 'react'

import { TabBar } from '../navigation/tabbar'

type ScreenLayoutProps = Omit<ComponentProps<typeof ScreenLayoutView>, 'onBack' | 'footer' | 'outerScrollId' | 'innerScrollId'> & {
  withGoBack?: boolean
  pageKey?: string
}

export const ScreenLayout = ({ withGoBack = false, pageKey, ...props }: ScreenLayoutProps) => {
  const router = useRouter()

  return (
    <ScreenLayoutView
      {...props}
      footer={pageKey ? <TabBar /> : undefined}
      onBack={withGoBack ? () => router.history.back() : undefined}
      // These ids match the router's scrollToTopSelectors.
      outerScrollId="screen-outer"
      innerScrollId="screen-inner"
    />
  )
}

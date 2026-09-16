import { ScreenLayout as ScreenLayoutView } from '@recipe-organizer/design-system/screen-layout'
import { useRouter } from '@tanstack/react-router'
import type React from 'react'

import { TabBar } from '../navigation/tabbar'

interface ScreenLayoutProps {
  backgroundImage?: string
  children: React.ReactNode
  headerEndItem?: React.ReactNode
  pageKey?: string
  title: string
  withGoBack?: boolean
}

export const ScreenLayout = ({ backgroundImage, children, headerEndItem, title, withGoBack = false, pageKey }: ScreenLayoutProps) => {
  const router = useRouter()

  return (
    <ScreenLayoutView
      backgroundImage={backgroundImage}
      headerEndItem={headerEndItem}
      title={title}
      footer={pageKey ? <TabBar /> : undefined}
      onBack={withGoBack ? () => router.history.back() : undefined}
      // These ids match the router's scrollToTopSelectors.
      innerScrollId="screen-inner"
      outerScrollId="screen-outer"
    >
      {children}
    </ScreenLayoutView>
  )
}

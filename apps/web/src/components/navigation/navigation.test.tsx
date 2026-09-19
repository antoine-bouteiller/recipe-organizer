import { Navbar } from '@recipe-organizer/design-system/navbar'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vite-plus/test'

import { desktopMenuItems, mobileMenuItems } from './constants'

const renderAt = async (pathname: string, content: ReactNode) => {
  const root = createRootRoute({ component: () => content })
  const routes = ['/', '/shopping-list', '/settings', '/settings/users'].map((path) => createRoute({ getParentRoute: () => root, path }))
  const router = createRouter({ history: createMemoryHistory({ initialEntries: [pathname] }), routeTree: root.addChildren(routes) })
  await router.load()
  return renderToStaticMarkup(createElement(RouterProvider, { router }))
}

describe('navigation composition', () => {
  it('preserves router link active state and exact home matching in the navbar', async () => {
    const markup = await renderAt('/settings/users', createElement(Navbar, { items: desktopMenuItems }))
    expect(markup).toMatch(/<a(?=[^>]*href="\/settings")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).not.toMatch(/<a(?=[^>]*href="\/")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).not.toContain('href="/search"')
  })

  it('forwards current page semantics through mobile items', async () => {
    const markup = await renderAt('/shopping-list', createElement(TabBar, { items: mobileMenuItems }))
    expect(markup).toMatch(/<a(?=[^>]*href="\/shopping-list")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).toContain('href="/search"')
  })

  it('keeps scroll restoration, footer selection, and back navigation in the shared layout', async () => {
    const page = await renderAt(
      '/',
      createElement(ScreenLayout, { footer: createElement(TabBar, { items: mobileMenuItems }), title: 'Home' }, 'Content')
    )
    expect(page).toContain('data-scroll-restoration-id="screen-outer"')
    expect(page).toContain('data-scroll-restoration-id="screen-inner"')
    expect(page).toContain('data-slot="tab-bar"')
    expect(page).toContain('data-footer-present="true"')
    expect(page).not.toContain('aria-label="Retour"')

    const detail = await renderAt('/settings', createElement(ScreenLayout, { title: 'Settings', withGoBack: true }, 'Content'))
    expect(detail).not.toContain('data-slot="tab-bar"')
    expect(detail).not.toContain('data-footer-present="true"')
    expect(detail).toContain('aria-label="Retour"')
  })
})

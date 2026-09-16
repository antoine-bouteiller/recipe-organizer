import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vite-plus/test'

import { ScreenLayout } from '../layout/screen-layout'
import { Navbar } from './navbar'
import { TabBar } from './tabbar'

const renderAt = async (pathname: string, content: ReactNode) => {
  const root = createRootRoute({ component: () => content })
  const routes = ['/', '/shopping-list', '/settings', '/settings/users'].map((path) => createRoute({ getParentRoute: () => root, path }))
  const router = createRouter({ history: createMemoryHistory({ initialEntries: [pathname] }), routeTree: root.addChildren(routes) })
  await router.load()
  return renderToStaticMarkup(createElement(RouterProvider, { router }))
}

describe('navigation composition', () => {
  it('preserves router link active state and exact home matching in the navbar', async () => {
    const markup = await renderAt('/settings/users', createElement(Navbar, { search: null }))
    expect(markup).toMatch(/<a(?=[^>]*href="\/settings")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).not.toMatch(/<a(?=[^>]*href="\/")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).not.toContain('href="/search"')
  })

  it('forwards current page semantics through mobile items', async () => {
    const markup = await renderAt('/shopping-list', createElement(TabBar))
    expect(markup).toMatch(/<a(?=[^>]*href="\/shopping-list")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).toContain('href="/search"')
  })

  it('keeps scroll restoration, footer selection, and back navigation in the app adapter', async () => {
    // oxlint-disable-next-line react/no-children-prop -- JSX is unavailable in .test.ts.
    const page = await renderAt('/', createElement(ScreenLayout, { children: 'Content', pageKey: '/', title: 'Home' }))
    expect(page).toContain('data-scroll-restoration-id="screen-outer"')
    expect(page).toContain('data-scroll-restoration-id="screen-inner"')
    expect(page).toContain('data-slot="tab-bar"')
    expect(page).toContain('data-footer-present="true"')
    expect(page).not.toContain('aria-label="Retour"')

    // oxlint-disable-next-line react/no-children-prop -- JSX is unavailable in .test.ts.
    const detail = await renderAt('/settings', createElement(ScreenLayout, { children: 'Content', title: 'Settings', withGoBack: true }))
    expect(detail).not.toContain('data-slot="tab-bar"')
    expect(detail).not.toContain('data-footer-present="true"')
    expect(detail).toContain('aria-label="Retour"')
  })
})

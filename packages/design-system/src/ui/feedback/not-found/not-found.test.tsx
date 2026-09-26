import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vite-plus/test'

import { NotFound } from './not-found'

const renderWithRouter = async (content: ReactNode) => {
  const rootRoute = createRootRoute({ component: () => content })
  const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' })
  const router = createRouter({ history: createMemoryHistory({ initialEntries: ['/'] }), routeTree: rootRoute.addChildren([homeRoute]) })
  await router.load()
  return renderToStaticMarkup(createElement(RouterProvider, { router }))
}

it('renders its default home link and allows callers to disable it', async () => {
  const markup = await renderWithRouter(createElement(NotFound))
  const withoutAction = await renderWithRouter(createElement(NotFound, { action: null }))

  expect(markup).toContain('href="/"')
  expect(markup).toContain('Retour à l&#x27;accueil')
  expect(withoutAction).not.toContain('href="/"')
})

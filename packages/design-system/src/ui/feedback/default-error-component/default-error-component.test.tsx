import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { DefaultErrorComponent } from './default-error-component'

const renderWithRouter = async (content: ReactNode) => {
  const rootRoute = createRootRoute({ component: () => content })
  const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' })
  const router = createRouter({ history: createMemoryHistory({ initialEntries: ['/'] }), routeTree: rootRoute.addChildren([homeRoute]) })
  await router.load()
  return renderToStaticMarkup(createElement(RouterProvider, { router }))
}

afterEach(() => vi.unstubAllEnvs())

it('does not disclose Error details in production', async () => {
  vi.stubEnv('DEV', false)
  const markup = await renderWithRouter(createElement(DefaultErrorComponent, { error: new Error('Sensitive diagnostic') }))

  expect(markup).not.toContain('Sensitive diagnostic')
  expect(markup).toContain('href="/"')
})

it('renders its default home link and exposes Error details in development', async () => {
  const markup = await renderWithRouter(createElement(DefaultErrorComponent, { error: new Error('Safe diagnostic') }))

  expect(markup).toContain('href="/"')
  expect(markup).toContain('Retour à la page d&#x27;accueil')
  expect(markup).toContain('Safe diagnostic')
})

it('does not expose non-Error values, while preserving explicit caller details', async () => {
  const hiddenDetails = await renderWithRouter(createElement(DefaultErrorComponent, { error: 'sensitive value' }))
  const suppliedDetails = await renderWithRouter(createElement(DefaultErrorComponent, { details: 'Caller diagnostic', error: 'sensitive value' }))

  expect(hiddenDetails).not.toContain('sensitive value')
  expect(suppliedDetails).toContain('Caller diagnostic')
})

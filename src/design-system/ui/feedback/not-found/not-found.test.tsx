import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vite-plus/test'

import { NotFound } from './not-found'

it('renders its default home link and allows callers to disable it', () => {
  const markup = renderToStaticMarkup(createElement(NotFound))
  const withoutAction = renderToStaticMarkup(createElement(NotFound, { action: null }))

  expect(markup).toContain('href="/"')
  expect(markup).toContain('Retour à l&#x27;accueil')
  expect(withoutAction).not.toContain('href="/"')
})

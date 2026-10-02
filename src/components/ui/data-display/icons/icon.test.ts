import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vite-plus/test'

import { ArrowLeftIcon } from './arrow-left'

it('hides decorative icons and retains intrinsic dimensions before CSS loads', () => {
  const markup = renderToStaticMarkup(createElement(ArrowLeftIcon))
  expect(markup).toContain('aria-hidden="true"')
  expect(markup).toContain('width="1em"')
  expect(markup).toContain('height="1em"')
  expect(markup).not.toContain('role="img"')
})

it('exposes a named image instead of hiding an informative icon', () => {
  const markup = renderToStaticMarkup(createElement(ArrowLeftIcon, { 'aria-label': 'Back' }))
  expect(markup).toContain('role="img"')
  expect(markup).toContain('aria-label="Back"')
  expect(markup).not.toContain('aria-hidden')
})

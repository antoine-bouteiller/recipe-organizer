import { Dialog } from '@base-ui/react/dialog'
import { Toggle } from '@base-ui/react/toggle'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vite-plus/test'

import { Button } from './button'

it('retains the accessibility attributes composed by a dialog trigger', () => {
  const markup = renderToStaticMarkup(createElement(Dialog.Root, null, createElement(Dialog.Trigger, { render: createElement(Button) }, 'Open')))
  expect(markup).toContain('aria-haspopup="dialog"')
  expect(markup).toContain('aria-expanded="false"')
})

it('transports primitive pressed state through the closed Button render seam', () => {
  const markup = renderToStaticMarkup(createElement(Toggle, { pressed: true, render: createElement(Button) }, 'Bold'))
  expect(markup).toContain('data-pressed=""')
})

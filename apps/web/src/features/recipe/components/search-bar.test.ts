import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import SearchBar from './search-bar'

afterEach(() => vi.unstubAllGlobals())

describe('desktop search trigger', () => {
  it.each([true, false])('does not fetch recipes before interaction (mobile: %s)', (mobile) => {
    const matchMedia = vi.fn().mockReturnValue({ matches: mobile })
    const fetch = vi.fn()
    vi.stubGlobal('matchMedia', matchMedia)
    vi.stubGlobal('navigator', { userAgent: 'Macintosh' })
    vi.stubGlobal('fetch', fetch)

    const markup = renderToStaticMarkup(createElement(SearchBar))

    expect(matchMedia).toHaveBeenCalledWith('(width < 768px)')
    expect(fetch).not.toHaveBeenCalled()
    if (mobile) {
      expect(markup).toBe('')
    } else {
      expect(markup).toContain('aria-label="Rechercher une recette"')
      expect(markup).not.toContain('role="dialog"')
    }
  })
})

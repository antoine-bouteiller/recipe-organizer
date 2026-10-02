import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vite-plus/test'

import { AppHeader } from '@/components/app-shell/app-shell'
import { GoBackButton, ScreenLayout } from '@/design-system/ui/layout/screen-layout/screen-layout'
import { TabBar } from '@/design-system/ui/navigation/tabbar/tabbar'

import { mobileMenuItems } from './constants'

describe('navigation composition', () => {
  it('marks the current section in the navbar and matches home exactly', () => {
    const markup = renderToStaticMarkup(createElement(AppHeader, { currentPath: '/settings/users' }))
    expect(markup).toMatch(/<a(?=[^>]*href="\/settings")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).not.toMatch(/<a(?=[^>]*href="\/")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).not.toContain('href="/search"')
  })

  it('forwards current page semantics through mobile items', () => {
    const markup = renderToStaticMarkup(createElement(TabBar, { currentPath: '/shopping-list', items: mobileMenuItems }))
    expect(markup).toMatch(/<a(?=[^>]*href="\/shopping-list")(?=[^>]*aria-current="page")[^>]*>/)
    expect(markup).toContain('href="/search"')
  })

  it('keeps scroll containers, footer selection, and back navigation in the shared layout', () => {
    const page = renderToStaticMarkup(
      createElement(ScreenLayout, { footer: createElement(TabBar, { currentPath: '/', items: mobileMenuItems }), title: 'Home' }, 'Content')
    )
    expect(page).toContain('data-scroll-restoration-id="screen-outer"')
    expect(page).toContain('data-scroll-restoration-id="screen-inner"')
    expect(page).toContain('data-slot="tab-bar"')
    expect(page).toContain('data-footer-present="true"')
    expect(page).not.toContain('aria-label="Retour"')

    const detail = renderToStaticMarkup(createElement(ScreenLayout, { backButton: createElement(GoBackButton), title: 'Settings' }, 'Content'))
    expect(detail).not.toContain('data-slot="tab-bar"')
    expect(detail).not.toContain('data-footer-present="true"')
    expect(detail).toContain('aria-label="Retour"')
  })
})

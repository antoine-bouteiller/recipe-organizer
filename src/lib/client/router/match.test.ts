import { describe, expect, it } from 'vite-plus/test'

import { isAppPath, matchRoute } from './match'
import { routes } from './routes'

const patternOf = (pathname: string) => matchRoute(routes, pathname)?.route.pattern

describe('matchRoute', () => {
  it('matches static recipe routes before the recipe detail pattern', () => {
    expect(patternOf('/recipe/new')).toBe('/recipe/new')
    expect(matchRoute(routes, '/recipe/edit/7')).toMatchObject({ params: { id: '7' }, route: { pattern: '/recipe/edit/:id' } })
    expect(matchRoute(routes, '/recipe/12')).toMatchObject({ params: { id: '12' }, route: { pattern: '/recipe/:id' } })
  })

  it('matches the home route and ignores a trailing slash', () => {
    expect(patternOf('/')).toBe('/')
    expect(patternOf('/settings/')).toBe('/settings')
  })

  it('decodes parameters', () => {
    expect(matchRoute([{ pattern: '/tag/:name' }], '/tag/caf%C3%A9')?.params).toEqual({ name: 'café' })
  })

  it('returns nothing for unknown paths', () => {
    expect(matchRoute(routes, '/recipe')).toBeUndefined()
    expect(matchRoute(routes, '/recipe/1/extra')).toBeUndefined()
    expect(matchRoute(routes, '/unknown')).toBeUndefined()
  })
})

describe('isAppPath', () => {
  const origin = 'https://recipes.test'

  it('accepts same-origin document paths', () => {
    expect(isAppPath(new URL('/recipe/1?tab=steps', origin), origin)).toBe(true)
  })

  it('leaves the API, files and other origins to the browser', () => {
    expect(isAppPath(new URL('/api', origin), origin)).toBe(false)
    expect(isAppPath(new URL('/api/recipes', origin), origin)).toBe(false)
    expect(isAppPath(new URL('/manifest.json', origin), origin)).toBe(false)
    expect(isAppPath(new URL('/recipe/1', 'https://other.test'), origin)).toBe(false)
  })
})

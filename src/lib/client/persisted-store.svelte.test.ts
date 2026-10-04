import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { persistedStore, readSaved } from './persisted-store.svelte'

const storage = new Map<string, string>()

beforeEach(() => {
  storage.clear()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('readSaved (VC-5)', () => {
  it('returns undefined when nothing is stored', () => {
    expect(readSaved('shopping-list', [])).toBeUndefined()
  })

  it('returns stored selections and serving overrides', () => {
    storage.set('shopping-list', '[3,5]')
    storage.set('recipe-quantities', '{"3":6}')
    expect(readSaved('shopping-list', [])).toEqual([3, 5])
    expect(readSaved('recipe-quantities', {})).toEqual({ 3: 6 })
  })

  it('discards malformed JSON', () => {
    storage.set('recent-recipes', '[1,')
    expect(readSaved('recent-recipes', [])).toBeUndefined()
  })

  it('discards stale shapes such as legacy zustand wrappers', () => {
    storage.set('shopping-list', '{"state":{"list":[1]},"version":0}')
    expect(readSaved('shopping-list', [])).toBeUndefined()
  })
})

describe('persistedStore (VC-5)', () => {
  it('applies updates to the stored value and saves the same JSON shape', () => {
    storage.set('shopping-list', '[3]')
    const { setState } = persistedStore<number[]>('shopping-list', [])
    setState((ids) => [...ids, 5])
    expect(storage.get('shopping-list')).toBe('[3,5]')
  })

  it('starts updates from the initial value when storage holds stale data', () => {
    storage.set('recipe-quantities', '[1]')
    const { setState } = persistedStore<Record<number, number>>('recipe-quantities', {})
    setState((quantities) => ({ ...quantities, 2: 4 }))
    expect(storage.get('recipe-quantities')).toBe('{"2":4}')
  })
})

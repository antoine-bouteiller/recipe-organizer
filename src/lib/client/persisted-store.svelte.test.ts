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
  it('does not access available storage while constructing a server store', () => {
    const getItem = vi.fn(() => '[3]')
    vi.stubGlobal('localStorage', { getItem })

    const { useValue } = persistedStore<number[]>('shopping-list', [])

    expect(useValue().current).toEqual([])
    expect(getItem).not.toHaveBeenCalled()
  })

  it('does not run server updates that could mutate the shared initial snapshot', () => {
    vi.stubGlobal('localStorage', undefined)
    const initial: number[] = []
    const { setState, useValue } = persistedStore('shopping-list', initial)
    const snapshot = useValue()
    const update = vi.fn((ids: number[]) => {
      ids.push(3)
      return ids
    })

    setState(update)

    expect(snapshot.current).toEqual([])
    expect(update).not.toHaveBeenCalled()
    expect(useValue().current).toEqual([])
  })
})

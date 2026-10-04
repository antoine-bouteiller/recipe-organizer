import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import { persistedStore } from './persisted-store.svelte'

afterEach(() => {
  vi.unstubAllGlobals()
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

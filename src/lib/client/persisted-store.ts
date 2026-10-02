import { Store } from '@tanstack/react-store'
import { useSyncExternalStore } from 'react'

const readSaved = <TValue>(key: string, initial: TValue): TValue | undefined => {
  const raw = localStorage.getItem(key)
  if (raw == null) {
    return undefined
  }
  try {
    const parsed: TValue = JSON.parse(raw)
    // Discard stale data whose shape no longer matches (e.g. legacy zustand `{ state, version }` wrappers).
    return Array.isArray(parsed) === Array.isArray(initial) ? parsed : undefined
  } catch {
    return undefined
  }
}

export const persistedStore = <TValue>(key: string, initial: TValue) => {
  const hasStorage = typeof localStorage !== 'undefined'
  const store = new Store<TValue>((hasStorage && readSaved(key, initial)) || initial)
  if (hasStorage) {
    store.subscribe(() => localStorage.setItem(key, JSON.stringify(store.get())))
  }
  const subscribe = (onChange: () => void) => store.subscribe(onChange).unsubscribe
  const getSnapshot = () => store.get()
  // Server HTML and hydration render `initial`; React then re-renders with the saved value.
  const getServerSnapshot = () => initial
  const useValue = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return { store, useValue }
}

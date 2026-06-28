import { Store } from '@tanstack/react-store'

export const persistedStore = <TValue>(key: string, initial: TValue): Store<TValue> => {
  const hasStorage = typeof localStorage !== 'undefined'
  let saved: TValue | undefined = undefined
  if (hasStorage) {
    const raw = localStorage.getItem(key)
    if (raw != null) {
      try {
        const parsed = JSON.parse(raw) as TValue
        // Discard stale data whose shape no longer matches (e.g. legacy zustand `{ state, version }` wrappers).
        saved = Array.isArray(parsed) === Array.isArray(initial) ? parsed : undefined
      } catch {
        saved = undefined
      }
    }
  }
  const store = new Store<TValue>(saved ?? initial)
  if (hasStorage) {
    store.subscribe(() => localStorage.setItem(key, JSON.stringify(store.state)))
  }
  return store
}

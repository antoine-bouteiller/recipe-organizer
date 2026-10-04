import { useIsHydrated } from '@/hooks/use-is-hydrated.svelte'

export const readSaved = <TValue>(key: string, initial: TValue): TValue | undefined => {
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
  // Server modules never write, so this singleton stays `initial` across SSR requests.
  let value = $state.raw((hasStorage && readSaved(key, initial)) || initial)

  const setState = (update: (previous: TValue) => TValue) => {
    value = update(value)
    if (hasStorage) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
  /** Call during component setup; server HTML and hydration read `initial`, then the saved value after mount. */
  const useValue = () => {
    const hydration = useIsHydrated()
    return {
      get current() {
        return hydration.current ? value : initial
      },
    }
  }

  return { setState, useValue }
}

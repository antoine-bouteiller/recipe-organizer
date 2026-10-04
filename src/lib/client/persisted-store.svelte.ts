import { onMount } from 'svelte'

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
  let value = $state.raw(initial)
  let hydrated = false

  const setState = (update: (previous: TValue) => TValue) => {
    // Never run user updates on the server or overwrite saved data before the first mount.
    if (typeof globalThis.window === 'undefined' || !hydrated) {
      return
    }
    value = update(value)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
  /** Call during component setup; each reader stays neutral until mount, then shares the saved value. */
  const useValue = () => {
    let mounted = $state(false)
    onMount(() => {
      if (!hydrated) {
        value = (typeof localStorage !== 'undefined' && readSaved(key, initial)) || initial
        hydrated = true
      }
      mounted = true
    })
    return {
      get current() {
        return mounted ? value : initial
      },
    }
  }

  return { setState, useValue }
}

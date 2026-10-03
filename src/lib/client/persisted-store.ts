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
  let value = (hasStorage && readSaved(key, initial)) || initial
  const listeners = new Set<() => void>()

  const setState = (update: (previous: TValue) => TValue) => {
    value = update(value)
    if (hasStorage) {
      localStorage.setItem(key, JSON.stringify(value))
    }
    for (const listener of listeners) {
      listener()
    }
  }
  const subscribe = (onChange: () => void) => {
    listeners.add(onChange)
    return () => {
      listeners.delete(onChange)
    }
  }
  const getSnapshot = () => value
  // Server HTML and hydration render `initial`; React then re-renders with the saved value.
  const getServerSnapshot = () => initial
  const useValue = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return { setState, useValue }
}

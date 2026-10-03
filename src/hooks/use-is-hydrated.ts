import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined

/** False in server HTML and during hydration, so device-local state can show a neutral placeholder. */
export const useIsHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

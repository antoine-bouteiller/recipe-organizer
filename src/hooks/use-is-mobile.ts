import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(max-width: 768px)'

const getMatches = () => globalThis.matchMedia(MOBILE_QUERY).matches

const subscribe = (onStoreChange: () => void) => {
  const matchMedia = globalThis.matchMedia(MOBILE_QUERY)
  matchMedia.addEventListener('change', onStoreChange)

  return () => {
    matchMedia.removeEventListener('change', onStoreChange)
  }
}

// Server HTML assumes desktop; mobile clients re-render after hydration.
export const useIsMobile = (): boolean => useSyncExternalStore(subscribe, getMatches, () => false)

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

export const useIsMobile = (): boolean => useSyncExternalStore(subscribe, getMatches, getMatches)

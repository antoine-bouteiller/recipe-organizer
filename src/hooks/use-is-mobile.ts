import { useState } from 'react'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { createIsomorphicFn } from '@tanstack/react-start'

const MOBILE_QUERY = '(max-width: 768px)'

const getMatches = createIsomorphicFn()
  .client((query: string) => globalThis.matchMedia(query).matches)
  .server(() => false)

export const useIsMobile = (): boolean => {
  const [matches, setMatches] = useState<boolean>(() => getMatches(MOBILE_QUERY))

  const handleChange = () => {
    setMatches(getMatches(MOBILE_QUERY))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = globalThis.matchMedia(MOBILE_QUERY)

    handleChange()

    matchMedia.addEventListener('change', handleChange)

    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [])

  return matches
}

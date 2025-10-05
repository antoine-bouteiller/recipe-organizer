import { useState } from 'react'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'
import { createIsomorphicFn } from '@tanstack/react-start'

interface UseMediaQueryOptions {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const getMatches = createIsomorphicFn()
  .server((_: string) => false)
  .client((query: string) => globalThis.matchMedia(query).matches)

export const useMediaQuery = (
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = globalThis.matchMedia(query)

    handleChange()

    matchMedia.addEventListener('change', handleChange)

    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

export type { UseMediaQueryOptions }

import { createIsomorphicFn } from '@tanstack/solid-start'
import { getRequestHeaders } from '@tanstack/solid-start/server'
import { useState } from 'react'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

const MOBILE_QUERY = '(max-width: 768px)'

const getMatches = createIsomorphicFn()
  .client((query: string) => globalThis.matchMedia(query).matches)
  .server(() => {
    const headers = getRequestHeaders()
    const userAgent = headers.get('user-agent') ?? ''
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  })

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

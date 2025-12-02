import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { useEffect, useState } from 'react'

type Platform = 'Android' | 'iOS' | 'macOS' | 'Unknown' | 'Windows'

const getPlatform = createIsomorphicFn()
  .server(() => getPlatformFromUserAgent(getRequestHeader('user-agent')))
  .client(() => getPlatformFromUserAgent(navigator.userAgent))

const getPlatformFromUserAgent = (userAgent: string | undefined) => {
  if (!userAgent) {
    return 'Unknown'
  }
  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    return 'macOS'
  }
  if (/Windows NT/.test(userAgent)) {
    return 'Windows'
  }
  if (/Android/.test(userAgent)) {
    return 'Android'
  }
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return 'iOS'
  }
  return 'Unknown'
}

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform>(getPlatform())

  useEffect(() => {
    setPlatform(getPlatform())
  }, [])

  return platform
}

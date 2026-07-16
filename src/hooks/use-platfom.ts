import { createIsomorphicFn } from '@tanstack/solid-start'
import { getRequestHeader } from '@tanstack/solid-start/server'

type Platform = 'Android' | 'iOS' | 'macOS' | 'Unknown' | 'Windows'

const getPlatformFromUserAgent = (userAgent: string | undefined): Platform => {
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

const getPlatform = createIsomorphicFn()
  .server(() => getPlatformFromUserAgent(getRequestHeader('user-agent')))
  .client(() => getPlatformFromUserAgent(navigator.userAgent))

export const usePlatform = (): Platform => getPlatform()

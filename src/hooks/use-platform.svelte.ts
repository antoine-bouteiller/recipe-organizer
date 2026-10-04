import { useIsHydrated } from '@/hooks/use-is-hydrated.svelte'

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

/** Call during component setup; server HTML and hydration read 'Unknown'. */
export const usePlatform = () => {
  const hydration = useIsHydrated()
  return {
    get current(): Platform {
      return hydration.current ? getPlatformFromUserAgent(navigator.userAgent) : 'Unknown'
    },
  }
}

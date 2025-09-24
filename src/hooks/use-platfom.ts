import { useState, useEffect } from 'react'

type Platform = 'macOS' | 'Windows' | 'Android' | 'iOS' | 'Unknown'

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform>('Unknown')

  useEffect(() => {
    const { userAgent } = navigator

    if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
      setPlatform('macOS')
    } else if (/Windows NT/.test(userAgent)) {
      setPlatform('Windows')
    } else if (/Android/.test(userAgent)) {
      setPlatform('Android')
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      setPlatform('iOS')
    } else {
      setPlatform('Unknown')
    }
  }, [])

  return platform
}

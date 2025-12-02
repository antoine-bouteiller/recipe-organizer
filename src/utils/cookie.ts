import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie as getCookieServer, setCookie as setCookieServer } from '@tanstack/react-start/server'

export const getCookie = createIsomorphicFn()
  .server(getCookieServer)
  .client((key) => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const match = document.cookie.split('; ').find((row) => row.startsWith(`${key}=`))

    if (!match) {
      return undefined
    }

    return decodeURIComponent(match.split('=')[1])
  })

export const setCookie = createIsomorphicFn()
  .server(setCookieServer)
  .client((key, value, options = {}) => {
    if (typeof document === 'undefined') {
      return
    }

    const { domain, maxAge = 31_536_000, path = '/', sameSite = 'lax', secure = false } = options

    const cookieParts = [`${key}=${encodeURIComponent(value)}`, `path=${path}`, `max-age=${maxAge}`, `samesite=${sameSite}`]

    if (domain) {
      cookieParts.push(`domain=${domain}`)
    }

    if (secure) {
      cookieParts.push('secure')
    }

    document.cookie = cookieParts.join('; ')
  })

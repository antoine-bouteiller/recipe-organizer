interface CookieOptions {
  domain?: string
  maxAge?: number
  path?: string
  sameSite?: 'lax' | 'strict' | 'none'
  secure?: boolean
}

export const getCookie = (key: string): string | undefined => {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${key}=`))

  if (!match) {
    return undefined
  }

  return decodeURIComponent(match.split('=')[1])
}

export const setCookie = (key: string, value: string, options: CookieOptions = {}) => {
  const { domain, maxAge = 31_536_000, path = '/', sameSite = 'lax', secure = false } = options

  const cookieParts = [`${key}=${encodeURIComponent(value)}`, `path=${path}`, `max-age=${maxAge}`, `samesite=${sameSite}`]

  if (domain) {
    cookieParts.push(`domain=${domain}`)
  }

  if (secure) {
    cookieParts.push('secure')
  }

  document.cookie = cookieParts.join('; ')
}

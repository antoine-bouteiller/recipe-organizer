export interface RoutePattern {
  readonly pattern: `/${string}`
}

/** First route whose pattern matches `pathname`, with its decoded `:name` segments. */
export const matchRoute = <TRoute extends RoutePattern>(
  candidates: readonly TRoute[],
  pathname: string
): { params: Record<string, string>; route: TRoute } | undefined => {
  const segments = pathname.split('/').filter(Boolean)
  for (const route of candidates) {
    const parts = route.pattern.split('/').filter(Boolean)
    const params: Record<string, string> = {}
    const matches =
      parts.length === segments.length &&
      parts.every((part, index) => {
        const segment = segments[index] ?? ''
        if (part.startsWith(':')) {
          params[part.slice(1)] = decodeURIComponent(segment)
          return true
        }
        return part === segment
      })
    if (matches) {
      return { params, route }
    }
  }
  return undefined
}

/** Whether the router, rather than the browser, handles a navigation to `url`. */
export const isAppPath = (url: URL, origin: string) =>
  url.origin === origin && url.pathname !== '/api' && !url.pathname.startsWith('/api/') && !/\.[^/]+$/u.test(url.pathname)

import { tick } from 'svelte'
import type { Component } from 'svelte'

import { queryClient } from '@/lib/client/query-client'
import { sessionQuery } from '@/lib/client/session'

import { resolveGuardRedirect } from './guard'
import { isAppPath, matchRoute } from './match'
import { routes } from './routes'
import type { RouteComponent } from './routes'
import { applyScroll, captureScroll } from './scroll'
import type { ScrollSnapshot } from './scroll'

type ScreenComponent = Component<{ params: Record<string, string> }>

interface CurrentRoute {
  url: URL
  params: Record<string, string>
  component: ScreenComponent | undefined
  notFound: boolean
  error: unknown
}

type Resolution =
  | { kind: 'redirect'; href: string }
  | { kind: 'ready'; component: RouteComponent | undefined; error?: unknown; params: Record<string, string> }

const current = $state<CurrentRoute>({ component: undefined, error: undefined, notFound: false, params: {}, url: new URL(location.href) })
const scrollByEntry = new Map<string, ScrollSnapshot>()

const guard = async (url: URL) => {
  const match = matchRoute(routes, url.pathname)
  if (!match) {
    return { match }
  }
  const redirect = resolveGuardRedirect(match.route.access, await queryClient.query({ ...sessionQuery, staleTime: 'static' }))
  return { match, redirect }
}

const failed = (error: unknown, params: Record<string, string> = {}): Resolution => ({ component: undefined, error, kind: 'ready', params })

const resolve = async (url: URL): Promise<Resolution> => {
  let guarded: Awaited<ReturnType<typeof guard>> = { match: undefined }
  try {
    guarded = await guard(url)
  } catch (error) {
    return failed(error)
  }
  const { match, redirect } = guarded
  if (redirect) {
    return { href: redirect, kind: 'redirect' }
  }
  if (!match) {
    return { component: undefined, kind: 'ready', params: {} }
  }
  try {
    const [module] = await Promise.all([match.route.component(), match.route.preload?.(match.params)])
    return { component: module.default, kind: 'ready', params: match.params }
  } catch (error) {
    return failed(error, match.params)
  }
}

// Only the latest navigation, including the initial load, may commit or redirect.
let generation = 0

const commit = (url: URL, resolution: Extract<Resolution, { kind: 'ready' }>) => {
  current.url = url
  current.params = resolution.params
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Screens without props ignore the `params` the app passes to every screen.
  current.component = resolution.component as ScreenComponent | undefined
  current.error = resolution.error
  current.notFound = !resolution.component && resolution.error === undefined
}

const commitWithTransition = async (update: () => Promise<void>, { back, animate }: { back: boolean; animate: boolean }) => {
  if (!animate || !document.startViewTransition) {
    await update()
    return
  }
  const transition = document.startViewTransition(update)
  if (back) {
    transition.types?.add('back')
  }
  await transition.updateCallbackDone
}

const handleNavigate = (event: NavigateEvent) => {
  const url = new URL(event.destination.url)
  // `pushState` and `replaceState` (such as tab hashes) only update the URL of the current screen.
  const historyUpdate = event.destination.sameDocument && event.navigationType !== 'traverse'
  if (
    !event.canIntercept ||
    event.hashChange ||
    historyUpdate ||
    event.downloadRequest !== null ||
    event.formData ||
    !isAppPath(url, location.origin)
  ) {
    return
  }
  const from = navigation.currentEntry
  if (from) {
    scrollByEntry.set(from.key, captureScroll())
  }
  const traverse = event.navigationType === 'traverse'
  const back = traverse && event.destination.index < (from?.index ?? 0)
  const animate = !event.sourceElement?.closest('[data-view-transition="false"]')
  const destinationKey = event.destination.key
  generation += 1
  const own = generation
  const isLatest = () => own === generation && !event.signal.aborted
  event.intercept({
    focusReset: 'manual',
    handler: async () => {
      const resolution = await resolve(url)
      if (!isLatest()) {
        return
      }
      if (resolution.kind === 'redirect') {
        navigation.navigate(resolution.href, { history: 'replace' })
        return
      }
      await commitWithTransition(
        async () => {
          // A newer navigation can start between scheduling the transition and running its update.
          if (!isLatest()) {
            return
          }
          commit(url, resolution)
          await tick()
          if (isLatest()) {
            applyScroll(traverse ? scrollByEntry.get(destinationKey) : undefined)
          }
        },
        { animate, back }
      )
    },
    scroll: 'manual',
  })
}

const start = async () => {
  if ('navigation' in globalThis) {
    navigation.addEventListener('navigate', handleNavigate)
  }
  const own = generation
  const url = new URL(location.href)
  const resolution = await resolve(url)
  if (own !== generation) {
    return
  }
  if (resolution.kind === 'redirect') {
    // Without the Navigation API, a document navigation applies the redirect.
    if ('navigation' in globalThis) {
      navigation.navigate(resolution.href, { history: 'replace' })
    } else {
      location.replace(resolution.href)
    }
    return
  }
  commit(url, resolution)
}

const preload = async (href: string) => {
  const url = new URL(href, location.href)
  if (!isAppPath(url, location.origin)) {
    return
  }
  try {
    const { match, redirect } = await guard(url)
    if (match && !redirect) {
      await Promise.all([match.route.component(), match.route.preload?.(match.params)])
    }
  } catch {
    // The navigation itself surfaces a preload failure.
  }
}

const navigate = async (href: string, options?: { replace?: boolean }) => {
  if (!('navigation' in globalThis)) {
    location[options?.replace ? 'replace' : 'assign'](href)
    return
  }
  try {
    await navigation.navigate(href, { history: options?.replace ? 'replace' : 'auto' }).finished
  } catch (error) {
    // A newer navigation, such as a guard redirect, supersedes this one.
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      throw error
    }
  }
}

export const router = {
  get current(): Readonly<CurrentRoute> {
    return current
  },
  navigate,
  preload,
  start,
}

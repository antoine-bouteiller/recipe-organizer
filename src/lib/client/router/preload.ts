import type { Attachment } from 'svelte/attachments'

import { router } from './router.svelte'

/** Preloads the anchor's route code and data on intent (pointer, focus, touch) or once it scrolls into view. */
export const preloadLink =
  (strategy: 'intent' | 'viewport'): Attachment<HTMLAnchorElement> =>
  (anchor) => {
    const run = () => void router.preload(anchor.href)
    if (strategy === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          run()
        }
      })
      observer.observe(anchor)
      return () => observer.disconnect()
    }
    const events = ['pointerenter', 'focus', 'touchstart'] as const
    for (const name of events) {
      anchor.addEventListener(name, run, { passive: true })
    }
    return () => {
      for (const name of events) {
        anchor.removeEventListener(name, run)
      }
    }
  }

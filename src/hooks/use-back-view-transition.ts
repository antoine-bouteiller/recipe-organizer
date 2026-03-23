import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

/**
 * When enabled, intercepts popstate events (Android back button/gesture)
 * and wraps the navigation in a view transition with the back-slide animation.
 */
export const useBackViewTransition = (isEnabled: boolean) => {
  const router = useRouter()

  useEffect(() => {
    if (!isEnabled) {
      return
    }
    if (!document.startViewTransition) {
      return
    }

    let isRedispatching = false

    const handler = (event: PopStateEvent) => {
      if (isRedispatching) {
        return
      }

      // Prevent TanStack Router from processing this popstate immediately
      event.stopImmediatePropagation()

      document.documentElement.classList.add('back-transition')

      const transition = document.startViewTransition(async () => {
        // Re-dispatch so TanStack Router processes the navigation
        isRedispatching = true
        globalThis.dispatchEvent(new PopStateEvent('popstate', { state: event.state }))
        isRedispatching = false

        await new Promise<void>((resolve) => {
          const unsub = router.subscribe('onResolved', () => {
            unsub()
            resolve()
          })
        })
      })

      void transition.finished.then(() => {
        document.documentElement.classList.remove('back-transition')
      })
    }

    globalThis.addEventListener('popstate', handler, { capture: true })

    return () => {
      globalThis.removeEventListener('popstate', handler, { capture: true })
    }
  }, [isEnabled, router])
}

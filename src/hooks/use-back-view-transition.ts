import { useRouter, type AnyRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

const waitForRouterResolved = (router: AnyRouter) =>
  new Promise<void>((resolve) => {
    const unsub = router.subscribe('onResolved', () => {
      unsub()
      resolve()
    })
  })

const redispatchPopstate = (state: PopStateEvent['state']) => {
  globalThis.dispatchEvent(new PopStateEvent('popstate', { state }))
}

/**
 * When enabled, intercepts popstate events (Android back button/gesture)
 * and wraps the navigation in a view transition with the back-slide animation.
 */
export const useBackViewTransition = (isEnabled: boolean) => {
  const router = useRouter()

  useEffect(() => {
    if (!isEnabled || !document.startViewTransition) {
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

      // Re-dispatch inside the view transition so TanStack Router processes the navigation
      const transition = document.startViewTransition(async () => {
        isRedispatching = true
        redispatchPopstate(event.state)
        isRedispatching = false

        await waitForRouterResolved(router)
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

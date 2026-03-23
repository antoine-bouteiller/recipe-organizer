import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

/**
 * When enabled, intercepts popstate events (Android back button/gesture)
 * and wraps the navigation in a view transition with the back-slide animation.
 */
export const useBackViewTransition = (isEnabled: boolean) => {
  const router = useRouter()

  useEffect(() => {
    if (!isEnabled) return
    if (!document.startViewTransition) return

    let isRedispatching = false

    const handler = (e: PopStateEvent) => {
      if (isRedispatching) return

      // Prevent TanStack Router from processing this popstate immediately
      e.stopImmediatePropagation()

      document.documentElement.classList.add('back-transition')

      const transition = document.startViewTransition(async () => {
        // Re-dispatch so TanStack Router processes the navigation
        isRedispatching = true
        window.dispatchEvent(new PopStateEvent('popstate', { state: e.state }))
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

    window.addEventListener('popstate', handler, { capture: true })

    return () => {
      window.removeEventListener('popstate', handler, { capture: true })
    }
  }, [isEnabled, router])
}

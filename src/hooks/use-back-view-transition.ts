import { useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

/**
 * Pages that have a "go back" button (ScreenLayout with withGoBack).
 * When the Android back gesture/button is used on these pages,
 * we wrap the navigation in a view transition with the back animation.
 */
const isPageWithGoBack = (pathname: string) =>
  /^\/recipe\//.test(pathname) || /^\/settings\/\w/.test(pathname)

export const useBackViewTransition = () => {
  const router = useRouter()
  const currentPathRef = useRef(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  )

  useEffect(() => {
    if (!document.startViewTransition) return

    // Track the current pathname so we know which page we're leaving
    const unsubResolved = router.subscribe('onResolved', () => {
      currentPathRef.current = window.location.pathname
    })

    let isRedispatching = false

    const handler = (e: PopStateEvent) => {
      if (isRedispatching) return

      // Only apply back transition when leaving a page that has a go back button
      if (!isPageWithGoBack(currentPathRef.current)) return

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
      unsubResolved()
    }
  }, [router])
}

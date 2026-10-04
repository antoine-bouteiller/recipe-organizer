import { MediaQuery } from 'svelte/reactivity'

import { useIsHydrated } from '@/hooks/use-is-hydrated.svelte'

const mobile = new MediaQuery('(max-width: 768px)', false)

/** Call during component setup; server HTML and hydration assume desktop, mobile clients update after mount. */
export const useIsMobile = () => {
  const hydration = useIsHydrated()
  return {
    get current() {
      return hydration.current && mobile.current
    },
  }
}

import { onMount } from 'svelte'

// Never flipped during SSR, so it is never shared across requests.
const hydration = $state({ done: false })

/**
 * False in server HTML and during hydration, so device-local state can show a neutral placeholder.
 * Call during component setup; components mounted after the first hydration read true immediately.
 */
export const useIsHydrated = () => {
  onMount(() => {
    hydration.done = true
  })
  return {
    get current() {
      return hydration.done
    },
  }
}

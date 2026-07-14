import { WifiSlash } from 'phosphor-solid'
import { createSignal, onCleanup, onMount, Show } from 'solid-js'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = createSignal(true)
  const [isMounted, setIsMounted] = createSignal(false)

  onMount(() => {
    setIsOnline(globalThis.navigator.onLine)
    setIsMounted(true)

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    globalThis.addEventListener('online', handleOnline)
    globalThis.addEventListener('offline', handleOffline)

    onCleanup(() => {
      globalThis.removeEventListener('online', handleOnline)
      globalThis.removeEventListener('offline', handleOffline)
    })
  })

  return (
    <Show when={isMounted() && !isOnline()}>
      <div class="fixed top-0 right-0 left-0 z-40 w-full bg-yellow-500 px-4 py-3 text-sm font-medium text-yellow-900 shadow-md">
        <div class="mx-auto flex max-w-7xl items-center gap-3">
          <WifiSlash class="h-5 w-5 shrink-0" weight="fill" />
          <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être indisponibles.</span>
        </div>
      </div>
    </Show>
  )
}

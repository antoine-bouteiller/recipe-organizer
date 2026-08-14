import { WifiSlashIcon } from '@phosphor-icons/react'
import { useSyncExternalStore } from 'react'

const subscribe = (onStoreChange: () => void) => {
  globalThis.addEventListener('online', onStoreChange)
  globalThis.addEventListener('offline', onStoreChange)

  return () => {
    globalThis.removeEventListener('online', onStoreChange)
    globalThis.removeEventListener('offline', onStoreChange)
  }
}

export default function OfflineBanner() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => globalThis.navigator.onLine,
    () => true
  )

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-40 w-full bg-yellow-500 px-4 py-3 text-sm font-medium text-yellow-900 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <WifiSlashIcon className="h-5 w-5 shrink-0" weight="fill" />
        <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être indisponibles.</span>
      </div>
    </div>
  )
}

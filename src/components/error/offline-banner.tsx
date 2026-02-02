import { WifiSlashIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
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

    return () => {
      globalThis.removeEventListener('online', handleOnline)
      globalThis.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isMounted || isOnline) {
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

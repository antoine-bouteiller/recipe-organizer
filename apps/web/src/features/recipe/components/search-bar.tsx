import { Button } from '@client/components/ui/button'
import { Kbd, KbdGroup } from '@client/components/ui/kbd'
import { useIsMobile } from '@client/hooks/use-is-mobile'
import { usePlatform } from '@client/hooks/use-platfom'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const SearchCommandPalette = lazy(() => import('./search-command-palette'))

const SearchBar = () => {
  const [requested, setRequested] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isMobile = useIsMobile()
  const platform = usePlatform()

  useEffect(() => {
    if (isMobile) {
      return () => undefined
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setRequested((open) => !open)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobile])

  if (isMobile) {
    return null
  }

  return (
    <>
      <Button
        aria-keyshortcuts="Meta+K Control+K"
        aria-label="Rechercher une recette"
        className="w-56 justify-start pl-2.5 font-normal shadow-none"
        onClick={() => setRequested(true)}
        ref={triggerRef}
        variant="outline"
      >
        Recherche une recette...
        <KbdGroup aria-hidden="true" className="absolute top-1.5 right-1.5 gap-1">
          <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd className="aspect-square">K</Kbd>
        </KbdGroup>
      </Button>
      {requested && (
        <Suspense fallback={null}>
          <SearchCommandPalette finalFocus={triggerRef} onClose={() => setRequested(false)} />
        </Suspense>
      )}
    </>
  )
}

export default SearchBar

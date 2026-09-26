import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import type { ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'
import { usePlatform } from '@recipe-organizer/design-system/hooks/use-platform'
import { ArrowElbowDownLeftIcon } from '@recipe-organizer/design-system/icons/arrow-elbow-down-left'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import { Kbd, KbdGroup } from '@recipe-organizer/design-system/kbd'
import { ScrollArea } from '@recipe-organizer/design-system/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import * as styles from './search-bar.css'

const SearchBar = () => {
  const [open, setOpen] = useState(false)

  const platform = usePlatform()
  const navigate = useNavigate()

  const { data: recipes } = useQuery(getRecipeListOptions())

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <DialogPrimitive.Root onOpenChange={setOpen} open={open}>
      <div className={styles.container}>
        <DialogPrimitive.Trigger data-slot="command-dialog-trigger" render={<Button align="start" variant="outline" width="full" />}>
          Recherche une recette...
          <span className={styles.text}>
            <KbdGroup>
              <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
              <span className={styles.shortcutKey}>
                <Kbd>K</Kbd>
              </span>
            </KbdGroup>
          </span>
        </DialogPrimitive.Trigger>
      </div>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className={styles.backdrop} data-slot="command-dialog-backdrop" />
        <DialogPrimitive.Viewport className={styles.viewport} data-slot="command-dialog-viewport">
          <DialogPrimitive.Popup aria-label="Rechercher une recette" className={styles.popup} data-slot="command-dialog-popup">
            <AutocompletePrimitive.Root autoHighlight="always" inline items={recipes} keepHighlight open>
              <div className={styles.inputContainer}>
                <AutocompletePrimitive.InputGroup className={styles.inputGroup} data-slot="autocomplete-input-group">
                  <div aria-hidden className={styles.addon} data-slot="autocomplete-start-addon">
                    <MagnifyingGlassIcon />
                  </div>
                  <AutocompletePrimitive.Input
                    autoFocus
                    className={styles.input}
                    data-slot="autocomplete-input"
                    placeholder="Rechercher une recette"
                    aria-label="Rechercher une recette"
                  />
                </AutocompletePrimitive.InputGroup>
              </div>
              <div className={styles.panel} data-slot="command-panel">
                <AutocompletePrimitive.Empty className={styles.empty} data-slot="command-empty">
                  Aucun résultats trouvé.
                </AutocompletePrimitive.Empty>
                <ScrollArea scrollbarGutter="compact" scrollFade>
                  <AutocompletePrimitive.List className={styles.list} data-slot="command-list">
                    {(recipe: ReducedRecipe) => (
                      <AutocompletePrimitive.Item
                        className={styles.item}
                        data-slot="command-item"
                        key={recipe.id}
                        onClick={() => {
                          setOpen(false)
                          void navigate({
                            params: { id: recipe.id.toString() },
                            to: '/recipe/$id',
                          })
                        }}
                        value={recipe.name}
                      >
                        {recipe.name}
                      </AutocompletePrimitive.Item>
                    )}
                  </AutocompletePrimitive.List>
                </ScrollArea>
              </div>
              <div className={styles.footer} data-slot="command-footer">
                <div className={styles.footerShortcut}>
                  <Kbd>
                    <ArrowElbowDownLeftIcon />
                  </Kbd>
                  <span>Open</span>
                </div>
              </div>
            </AutocompletePrimitive.Root>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default SearchBar

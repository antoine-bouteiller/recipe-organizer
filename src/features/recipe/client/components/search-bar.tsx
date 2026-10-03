import { useRouter } from '@void/react'
import { Suspense, use, useEffect, useId, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

import { Button } from '@/components/ui/actions/button/button'
import { ArrowElbowDownLeftIcon, MagnifyingGlassIcon } from '@/components/ui/data-display/icons'
import { Kbd, KbdGroup } from '@/components/ui/data-display/kbd/kbd'
import { ScrollArea } from '@/components/ui/layout/scroll-area/scroll-area'
import { Dialog } from '@/components/ui/overlays/dialog/dialog'
import { loadRecipeList } from '@/features/recipe/client/api/get-all'
import { usePlatform } from '@/hooks/use-platform'
import type { ReducedRecipe } from '@/types/recipe'
import { normalize } from '@/utils/normalize'

import * as styles from './search-bar.css'

const SearchPalette = ({ onClose }: { onClose: () => void }) => {
  const recipes = use(loadRecipeList())
  const router = useRouter()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const normalizedQuery = normalize(query.trim())
  const results = recipes.filter((recipe) => normalize(recipe.name).includes(normalizedQuery))
  const highlighted = results.at(Math.min(highlightedIndex, results.length - 1))

  const select = (recipe: ReducedRecipe) => {
    onClose()
    void router.visit(`/recipe/${recipe.id}`)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && highlighted) {
      event.preventDefault()
      select(highlighted)
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length > 0) {
      event.preventDefault()
      const current = results.indexOf(highlighted ?? results[0])
      setHighlightedIndex((current + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length)
    }
  }

  return (
    <div className={styles.palette}>
      <div className={styles.inputContainer}>
        <div className={styles.inputGroup} data-slot="autocomplete-input-group">
          <div aria-hidden className={styles.addon} data-slot="autocomplete-start-addon">
            <MagnifyingGlassIcon />
          </div>
          <input
            aria-activedescendant={highlighted ? `${listId}-${highlighted.id}` : undefined}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded
            aria-label="Rechercher une recette"
            autoFocus
            className={styles.input}
            data-slot="autocomplete-input"
            onChange={(event) => {
              setQuery(event.target.value)
              setHighlightedIndex(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Rechercher une recette"
            role="combobox"
            value={query}
          />
        </div>
      </div>
      <div className={styles.panel} data-slot="command-panel">
        {results.length === 0 && (
          <div className={styles.empty} data-slot="command-empty">
            Aucun résultats trouvé.
          </div>
        )}
        <ScrollArea scrollbarGutter="compact">
          <div className={styles.list} data-slot="command-list" id={listId} role="listbox">
            {results.map((recipe, index) => (
              <div
                aria-selected={recipe === highlighted}
                className={styles.item}
                data-highlighted={recipe === highlighted || undefined}
                data-slot="command-item"
                id={`${listId}-${recipe.id}`}
                key={recipe.id}
                onClick={() => select(recipe)}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setHighlightedIndex(index)}
                ref={recipe === highlighted ? (element) => element?.scrollIntoView({ block: 'nearest' }) : undefined}
                role="option"
              >
                {recipe.name}
              </div>
            ))}
          </div>
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
    </div>
  )
}

const SearchBar = () => {
  const [open, setOpen] = useState(false)

  const platform = usePlatform()

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
    <div className={styles.container}>
      <Dialog
        bare
        onOpenChange={setOpen}
        open={open}
        title="Rechercher une recette"
        renderTrigger={(props) => (
          <Button {...props} align="start" variant="outline" width="full">
            Recherche une recette...
            <span className={styles.text}>
              <KbdGroup>
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <span className={styles.shortcutKey}>
                  <Kbd>K</Kbd>
                </span>
              </KbdGroup>
            </span>
          </Button>
        )}
      >
        <Suspense>
          <SearchPalette onClose={() => setOpen(false)} />
        </Suspense>
      </Dialog>
    </div>
  )
}

export default SearchBar

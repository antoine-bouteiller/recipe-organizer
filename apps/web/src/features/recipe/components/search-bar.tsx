import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { type ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from '@recipe-organizer/design-system/command'
import { usePlatform } from '@recipe-organizer/design-system/hooks/use-platform'
import { ArrowElbowDownLeftIcon } from '@recipe-organizer/design-system/icons/arrow-elbow-down-left'
import { Kbd, KbdGroup } from '@recipe-organizer/design-system/kbd'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { container, text, text2, container2 } from './search-bar.css'

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
    <CommandDialog onOpenChange={setOpen} open={open}>
      <div className={container}>
        <CommandDialogTrigger render={<Button align="start" variant="search-trigger" width="full" />}>
          Recherche une recette...
          <span className={text}>
            <KbdGroup>
              <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
              <span className={text2}>
                <Kbd>K</Kbd>
              </span>
            </KbdGroup>
          </span>
        </CommandDialogTrigger>
      </div>
      <CommandDialogPopup>
        <Command items={recipes}>
          <CommandInput placeholder="Rechercher une recette" />
          <CommandPanel>
            <CommandEmpty>Aucun résultats trouvé.</CommandEmpty>
            <CommandList>
              {(recipe: ReducedRecipe) => (
                <CommandItem
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
                </CommandItem>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className={container2}>
              <Kbd>
                <ArrowElbowDownLeftIcon />
              </Kbd>
              <span>Open</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  )
}

export default SearchBar

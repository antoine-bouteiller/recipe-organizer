import { ArrowElbowDownLeftIcon } from '@client/components/icons'
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from '@client/components/ui/command'
import { Kbd } from '@client/components/ui/kbd'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { type ReducedRecipe } from '@client/types/recipe'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useRef, type RefObject } from 'react'

interface SearchCommandPaletteProps {
  finalFocus: RefObject<HTMLElement | null>
  onClose: () => void
}

const SearchCommandPalette = ({ finalFocus, onClose }: SearchCommandPaletteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { data: recipes } = useQuery(getRecipeListOptions())

  const close = () => onClose()

  return (
    <CommandDialog onOpenChange={(open) => !open && close()} open>
      <CommandDialogPopup finalFocus={finalFocus} initialFocus={inputRef}>
        <Command items={recipes}>
          <CommandInput placeholder="Rechercher une recette" ref={inputRef} />
          <CommandPanel>
            <CommandEmpty>Aucun résultats trouvé.</CommandEmpty>
            <CommandList>
              {(recipe: ReducedRecipe) => (
                <CommandItem
                  key={recipe.id}
                  onClick={() => {
                    close()
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
            <div className="flex items-center gap-2 text-foreground">
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

export default SearchCommandPalette

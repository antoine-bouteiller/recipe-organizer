import { useQuery } from '@tanstack/solid-query'
import { useNavigate } from '@tanstack/solid-router'
import { createSignal, onCleanup, onMount } from 'solid-js'
import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left'

import { Button } from '@/components/ui/button'
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
} from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { usePlatform } from '@/hooks/use-platfom'
import { type ReducedRecipe } from '@/types/recipe'

const SearchBar = () => {
  const [open, setOpen] = createSignal(false)

  const platform = usePlatform()
  const navigate = useNavigate()

  const query = useQuery(() => getRecipeListOptions())

  onMount(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    onCleanup(() => document.removeEventListener('keydown', down))
  })

  return (
    <CommandDialog onOpenChange={setOpen} open={open()}>
      <CommandDialogTrigger as={Button} class="w-56 justify-start pl-2.5 font-normal shadow-none" variant="outline">
        Recherche une recette...
        <KbdGroup class="absolute top-1.5 right-1.5 gap-1">
          <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd class="aspect-square">K</Kbd>
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command>
          <CommandInput placeholder="Rechercher une recette" />
          <CommandPanel>
            <CommandEmpty>Aucun résultats trouvé.</CommandEmpty>
            <CommandList items={query.data}>
              {(recipe: ReducedRecipe) => (
                <CommandItem
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
            <div class="flex items-center gap-2 text-foreground">
              <Kbd>
                <ArrowElbowDownLeft />
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

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { usePlatform } from '@/hooks/use-platfom'
import { ArrowElbowDownLeftIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const SearchBar = () => {
  const [open, setOpen] = useState(false)

  const platform = usePlatform()
  const navigate = useNavigate()

  const { data: recipes } = useQuery(getRecipeListOptions())

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="pl-2.5 justify-start font-normal shadow-none w-56"
        onClick={() => setOpen(true)}
      >
        Recherche une recette...
        <KbdGroup className="absolute top-1.5 right-1.5 gap-1">
          <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd className="aspect-square">K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher une recette" />
        <CommandList>
          <CommandEmpty>Aucun résultats trouvé.</CommandEmpty>
          <CommandGroup>
            {recipes?.map((recipe) => (
              <CommandItem
                key={recipe.id}
                onSelect={() => {
                  setOpen(false)
                  void navigate({
                    to: '/recipe/$id',
                    params: { id: recipe.id.toString() },
                  })
                }}
              >
                {recipe.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="text-muted-foreground flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <Kbd>
              <ArrowElbowDownLeftIcon />
            </Kbd>{' '}
            Rejoindre la page
          </div>
        </div>
      </CommandDialog>
    </>
  )
}

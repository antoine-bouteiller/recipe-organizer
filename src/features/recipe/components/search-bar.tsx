import { ArrowElbowDownLeftIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { usePlatform } from '@/hooks/use-platfom'

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
      <Button className="w-56 justify-start pl-2.5 font-normal shadow-none" onClick={() => setOpen(true)} variant="outline">
        Recherche une recette...
        <KbdGroup className="absolute top-1.5 right-1.5 gap-1">
          <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd className="aspect-square">K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
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
                    params: { id: recipe.id.toString() },
                    to: '/recipe/$id',
                  })
                }}
              >
                {recipe.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div
          className={`
            flex h-10 items-center gap-2 rounded-b-xl border-t
            border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium
            text-muted-foreground
            dark:border-t-neutral-700 dark:bg-neutral-800
          `}
        >
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

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandMenuKbd,
} from '@/components/ui/command'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import { usePlatform } from '@/hooks/use-platfom'
import { useQuery } from '@tanstack/react-query'
import { CornerDownLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const SearchBar = () => {
  const [open, setOpen] = useState(false)

  const platform = usePlatform()

  const { data: recipes } = useQuery(getAllRecipesQueryOptions())

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
        variant="secondary"
        className="bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
          <CommandMenuKbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</CommandMenuKbd>
          <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher une recette" />
        <CommandList>
          <CommandEmpty>Aucun résultats trouvé.</CommandEmpty>
          <CommandGroup>
            {recipes?.map((recipe) => (
              <CommandItem key={recipe.id}>{recipe.name}</CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{' '}
            Rejoindre la page
          </div>
        </div>
      </CommandDialog>
    </>
  )
}

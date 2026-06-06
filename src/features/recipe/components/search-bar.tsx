import { ArrowElbowDownLeftIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/common/button'
import { Command } from '@/components/common/command'
import { Kbd } from '@/components/common/kbd'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { usePlatform } from '@/hooks/use-platfom'
import { type Recipe } from '@/types/recipe'

export const SearchBar = () => {
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
    <Command.Dialog onOpenChange={setOpen} open={open}>
      <Command.DialogTrigger className="w-56 justify-start pl-2.5 font-normal shadow-none" render={<Button variant="outline" />}>
        Recherche une recette...
        <Kbd.Group className="absolute top-1.5 right-1.5 gap-1">
          <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd className="aspect-square">K</Kbd>
        </Kbd.Group>
      </Command.DialogTrigger>
      <Command.DialogPopup>
        <Command items={recipes}>
          <Command.Input placeholder="Rechercher une recette" />
          <Command.Panel>
            <Command.Empty>Aucun résultats trouvé.</Command.Empty>
            <Command.List>
              {(recipe: Recipe) => (
                <Command.Item
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
                </Command.Item>
              )}
            </Command.List>
          </Command.Panel>
          <Command.Footer>
            <div className="flex items-center gap-2">
              <Kbd>
                <ArrowElbowDownLeftIcon />
              </Kbd>
              <span>Open</span>
            </div>
          </Command.Footer>
        </Command>
      </Command.DialogPopup>
    </Command.Dialog>
  )
}

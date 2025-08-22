import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SearchSelect } from '@/components/ui/searchselect'
import { useQuery } from '@tanstack/react-query'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import { useState } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'

interface AddExistingRecipeProps {
  onSelect: (selectedRecipe: { recipeId: number; name: string; ratio: number }) => void
}

export default function AddExistingRecipe({ onSelect }: AddExistingRecipeProps) {
  const { data: recipes } = useQuery(getAllRecipesQueryOptions())

  const recipesOptions =
    recipes?.map((recipe) => ({
      label: recipe.name,
      value: recipe.id.toString(),
    })) ?? []

  const [selectedRecipe, setSelectedRecipe] = useState<{
    recipeId: number
    name: string
    ratio: number
  }>()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="flex-1">
          Ajouter une recette existante
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une recette existante</DialogTitle>
        </DialogHeader>
        <SearchSelect
          options={recipesOptions}
          onChange={(option) => {
            setSelectedRecipe({
              recipeId: Number.parseInt(option.value),
              name: option.label,
              ratio: 1,
            })
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">
              Annuler
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!selectedRecipe}
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedRecipe) {
                  onSelect(selectedRecipe)
                }
              }}
            >
              Ajouter
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

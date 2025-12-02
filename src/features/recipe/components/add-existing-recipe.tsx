import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { useRecipeOptions } from '@/hooks/use-options'

interface AddExistingRecipeProps {
  readonly disabled?: boolean
  readonly onSelect: (selectedRecipe: { name: string; ratio: number; recipeId: number }) => void
}

export default function AddExistingRecipe({ disabled, onSelect }: Readonly<AddExistingRecipeProps>) {
  const recipesOptions = useRecipeOptions()

  const [selectedRecipe, setSelectedRecipe] = useState<{
    name: string
    ratio: number
    recipeId: number
  }>()

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger render={<Button className="md:flex-1" disabled={disabled} size="sm" type="button" variant="outline" />}>
        Ajouter une recette existante
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Ajouter une recette existante</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="p-4">
          <Combobox
            noResultsLabel="Aucune recette trouvée"
            onChange={(option) =>
              setSelectedRecipe({
                name: option.label,
                ratio: 1,
                recipeId: option.value,
              })
            }
            options={recipesOptions}
            placeholder="Rechercher une recette"
            searchPlaceholder="Rechercher une recette"
          />
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>Annuler</ResponsiveDialogClose>
          <Button
            disabled={!selectedRecipe}
            onClick={() => {
              if (selectedRecipe) {
                onSelect(selectedRecipe)
                return true
              }
              return false
            }}
            variant="default"
          >
            Ajouter
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

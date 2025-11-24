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
import { useState } from 'react'

interface AddExistingRecipeProps {
  readonly onSelect: (selectedRecipe: { recipeId: number; name: string; ratio: number }) => void
  readonly disabled?: boolean
}

export default function AddExistingRecipe({
  onSelect,
  disabled,
}: Readonly<AddExistingRecipeProps>) {
  const recipesOptions = useRecipeOptions()

  const [selectedRecipe, setSelectedRecipe] = useState<{
    recipeId: number
    name: string
    ratio: number
  }>()

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="md:flex-1"
            disabled={disabled}
          />
        }
      >
        Ajouter une recette existante
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Ajouter une recette existante</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="p-4">
          <Combobox
            placeholder="Rechercher une recette"
            noResultsLabel="Aucune recette trouvée"
            searchPlaceholder="Rechercher une recette"
            options={recipesOptions}
            onChange={(option) =>
              setSelectedRecipe({
                recipeId: option.value,
                name: option.label,
                ratio: 1,
              })
            }
          />
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>
            Annuler
          </ResponsiveDialogClose>
          <Button
            variant="default"
            disabled={!selectedRecipe}
            onClick={() => {
              if (selectedRecipe) {
                onSelect(selectedRecipe)
                return true
              }
              return false
            }}
          >
            Ajouter
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

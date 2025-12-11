import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'

import type { SubrecipeNodeData } from '@/components/tiptap/types/subrecipe'

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

import type { DialogTrigger } from '../ui/dialog'

interface SubrecipeDialogProps {
  children: ReactNode
  initialData?: SubrecipeNodeData
  onSubmit: (data: SubrecipeNodeData) => void
  submitLabel: string
  title: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const SubrecipeDialog = ({ children, initialData, onSubmit, submitLabel, title, triggerRender }: SubrecipeDialogProps) => {
  const [open, setOpen] = useState(false)
  const recipesOptions = useRecipeOptions()

  const [selectedRecipe, setSelectedRecipe] = useState<SubrecipeNodeData | undefined>(initialData)

  const handleSubmit = () => {
    if (selectedRecipe) {
      onSubmit(selectedRecipe)
      setOpen(false)
    }
  }

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      <ResponsiveDialogTrigger render={triggerRender}>{children}</ResponsiveDialogTrigger>

      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div
          className={`
            flex flex-col gap-2 px-4 py-4
            md:px-0
          `}
        >
          <Combobox
            noResultsLabel="Aucune recette trouvée"
            onChange={(option) =>
              setSelectedRecipe({
                recipeId: option.value,
                recipeName: option.label,
              })
            }
            options={recipesOptions}
            placeholder="Sélectionner une recette"
            searchPlaceholder="Rechercher une recette"
            value={selectedRecipe?.recipeId}
          />
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>Annuler</ResponsiveDialogClose>
          <Button disabled={!selectedRecipe} onClick={handleSubmit} variant="default">
            {submitLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

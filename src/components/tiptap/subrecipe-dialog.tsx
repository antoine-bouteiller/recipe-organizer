import { type ComponentPropsWithoutRef, type ReactNode, useMemo, useState } from 'react'

import type { SubrecipeNodeData } from '@/components/tiptap/types/subrecipe'

import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogPopup,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { useLinkedRecipes } from '@/contexts/linked-recipes-context'
import { useRecipeOptions } from '@/hooks/use-options'

import type { DialogTrigger } from '../ui/dialog'

interface SubrecipeDialogProps {
  children: ReactNode
  className?: string
  initialData?: SubrecipeNodeData
  onSubmit: (data: SubrecipeNodeData) => void
  submitLabel: string
  title: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const SubrecipeDialog = ({ children, className, initialData, onSubmit, submitLabel, title, triggerRender }: SubrecipeDialogProps) => {
  const [open, setOpen] = useState(false)
  const linkedRecipeIds = useLinkedRecipes()
  const allRecipesOptions = useRecipeOptions()

  // Filter recipes to only show linked recipes
  const recipesOptions = useMemo(
    () => allRecipesOptions.filter((option) => linkedRecipeIds.includes(option.value)),
    [allRecipesOptions, linkedRecipeIds]
  )

  const [selectedRecipe, setSelectedRecipe] = useState<SubrecipeNodeData | undefined>(initialData)

  const handleSubmit = () => {
    if (selectedRecipe) {
      onSubmit(selectedRecipe)
      setOpen(false)
    }
  }

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      <ResponsiveDialogTrigger className={className} render={triggerRender}>
        {children}
      </ResponsiveDialogTrigger>

      <ResponsiveDialogPopup>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="flex flex-col gap-4 px-4 py-4 md:px-0">
          <div className="flex flex-col gap-2">
            <Label>Recette</Label>
            <Combobox
              onChange={(option) =>
                setSelectedRecipe((prev) => ({
                  hideFirstNodes: prev?.hideFirstNodes,
                  hideLastNodes: prev?.hideLastNodes,
                  recipeId: option.value,
                  recipeName: option.label,
                }))
              }
              options={recipesOptions}
              placeholder="Sélectionner une recette"
              searchPlaceholder="Rechercher une recette"
              value={selectedRecipe?.recipeId}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hideFirstNodes">Masquer les N premières étapes</Label>
              <Input
                id="hideFirstNodes"
                min={0}
                onChange={(e) => {
                  const value = e.target.value ? Number.parseInt(e.target.value, 10) : undefined
                  setSelectedRecipe((prev) =>
                    prev
                      ? {
                          ...prev,
                          hideFirstNodes: value,
                        }
                      : undefined
                  )
                }}
                placeholder="0"
                type="number"
                value={selectedRecipe?.hideFirstNodes ?? ''}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hideLastNodes">Masquer les N dernières étapes</Label>
              <Input
                id="hideLastNodes"
                min={0}
                onChange={(e) => {
                  const value = e.target.value ? Number.parseInt(e.target.value, 10) : undefined
                  setSelectedRecipe((prev) =>
                    prev
                      ? {
                          ...prev,
                          hideLastNodes: value,
                        }
                      : undefined
                  )
                }}
                placeholder="0"
                type="number"
                value={selectedRecipe?.hideLastNodes ?? ''}
              />
            </div>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>Annuler</ResponsiveDialogClose>
          <Button disabled={!selectedRecipe} onClick={handleSubmit} variant="default">
            {submitLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogPopup>
    </ResponsiveDialog>
  )
}

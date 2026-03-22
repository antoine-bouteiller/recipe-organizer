import { useMemo, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup } from '@/components/ui/combobox'
import type { DialogTrigger } from '@/components/ui/dialog'
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
import type { SubrecipeNodeData } from '@/features/recipe/types/subrecipe'
import type { Option } from '@/hooks/use-options'
import { useRecipeOptions } from '@/hooks/use-options'

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

  const recipesOptions = useMemo(
    () => allRecipesOptions.filter((option) => linkedRecipeIds.includes(option.value)),
    [allRecipesOptions, linkedRecipeIds]
  )

  const [selectedRecipe, setSelectedRecipe] = useState<SubrecipeNodeData | undefined>(initialData)

  const selectedOption = useMemo(
    () => recipesOptions.find((opt) => opt.value === selectedRecipe?.recipeId) ?? null,
    [recipesOptions, selectedRecipe?.recipeId]
  )

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
            <Combobox<Option<number>>
              items={recipesOptions}
              onValueChange={(option) =>
                setSelectedRecipe((prev) =>
                  option
                    ? {
                        hideFirstNodes: prev?.hideFirstNodes,
                        hideLastNodes: prev?.hideLastNodes,
                        recipeId: option.value,
                        recipeName: option.label,
                      }
                    : undefined
                )
              }
              value={selectedOption}
            >
              <ComboboxInput placeholder="Sélectionner une recette" showClear={Boolean(selectedOption)} />
              <ComboboxPopup>
                <ComboboxEmpty>Aucun résultat</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxPopup>
            </Combobox>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hideFirstNodes">Masquer les N premières étapes</Label>
              <Input
                id="hideFirstNodes"
                min={0}
                onChange={(event) => {
                  const value = event.target.value ? Number.parseInt(event.target.value, 10) : undefined
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
                onChange={(event) => {
                  const value = event.target.value ? Number.parseInt(event.target.value, 10) : undefined
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

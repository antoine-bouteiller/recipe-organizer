import { revalidateLogic } from '@tanstack/react-form'
import { useState, type ReactElement } from 'react'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { useLinkedRecipes } from '@/features/recipe/contexts/linked-recipes-context'
import { useRecipeOptions } from '@/features/recipe/hooks/use-recipe-options'
import { type SubrecipeNodeData } from '@/features/recipe/types/subrecipe'
import { useAppForm } from '@/hooks/use-app-form'

const subrecipeSchema = v.object({
  hideFirstNodes: v.pipe(v.number(), v.minValue(0)),
  hideLastNodes: v.pipe(v.number(), v.minValue(0)),
  recipeId: v.number(),
})

type SubrecipeFormInput = v.InferOutput<typeof subrecipeSchema>

interface SubrecipeDialogProps {
  initialData?: SubrecipeFormInput
  onSubmit: (data: SubrecipeNodeData) => void
  submitLabel: string
  title: string
  triggerRender?: ReactElement
}

const subrecipeDefaultValues: SubrecipeFormInput = {
  hideFirstNodes: 0,
  hideLastNodes: 0,
  recipeId: -1,
}

const FormDialog = getFormDialog(subrecipeDefaultValues)

export const SubrecipeDialog = ({ initialData, onSubmit, submitLabel, title, triggerRender }: SubrecipeDialogProps) => {
  const [open, setOpen] = useState(false)
  const linkedRecipeIds = useLinkedRecipes()
  const recipesOptions = useRecipeOptions({ filter: (recipe) => linkedRecipeIds.includes(recipe.id) })

  const form = useAppForm({
    defaultValues: initialData ?? subrecipeDefaultValues,
    onSubmit: async ({ value }) => {
      const validated = v.parse(subrecipeSchema, value)

      onSubmit({
        hideFirstNodes: validated.hideFirstNodes,
        hideLastNodes: validated.hideLastNodes,
        recipeId: validated.recipeId,
      })
      form.reset()
      setOpen(false)
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: subrecipeSchema,
    },
  })

  return (
    <FormDialog form={form} trigger={triggerRender} open={open} setOpen={setOpen} submitLabel={submitLabel} title={title}>
      <form.AppField name="recipeId">{({ ComboboxField }) => <ComboboxField label="Recette" options={recipesOptions} />}</form.AppField>
      <div className="grid grid-cols-2 gap-4">
        <form.AppField name="hideFirstNodes">{({ NumberField }) => <NumberField label="Masquer les N premières étapes" min={0} />}</form.AppField>
        <form.AppField name="hideLastNodes">{({ NumberField }) => <NumberField label="Masquer les N dernières étapes" min={0} />}</form.AppField>
      </div>
    </FormDialog>
  )
}

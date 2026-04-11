import { revalidateLogic } from '@tanstack/react-form'
import { useState, type ComponentPropsWithoutRef } from 'react'
import { z } from 'zod'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { type DialogTrigger } from '@/components/ui/dialog'
import { useLinkedRecipes } from '@/contexts/linked-recipes-context'
import { type SubrecipeNodeData } from '@/features/recipe/types/subrecipe'
import { useAppForm } from '@/hooks/use-app-form'
import { useRecipeOptions } from '@/hooks/use-options'

const subrecipeSchema = z.object({
  hideFirstNodes: z.number().min(0),
  hideLastNodes: z.number().min(0),
  recipeId: z.number(),
})

type SubrecipeFormInput = z.infer<typeof subrecipeSchema>

interface SubrecipeDialogProps {
  initialData?: SubrecipeFormInput
  onSubmit: (data: SubrecipeNodeData) => void
  submitLabel: string
  title: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
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
      const validated = subrecipeSchema.parse(value)

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

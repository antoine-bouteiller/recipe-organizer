import { useLinkedRecipes } from '@client/features/recipe/contexts/linked-recipes-context'
import { useRecipeOptions } from '@client/features/recipe/hooks/use-recipe-options'
import { type SubrecipeNodeData } from '@client/features/recipe/types/subrecipe'
import { css } from '@recipe-organizer/design-system/css'
import { getFormDialog } from '@recipe-organizer/design-system/form-dialog'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useState, type ReactElement } from 'react'
import * as z from 'zod'

const subrecipeSchema = z.object({
  hideFirstNodes: z.number().min(0),
  hideLastNodes: z.number().min(0),
  recipeId: z.number(),
})

type SubrecipeFormInput = z.infer<typeof subrecipeSchema>

export interface SubrecipeDialogProps {
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
const subrecipeFields = css({ display: 'grid', gap: '4', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' })

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
      <div className={subrecipeFields}>
        <form.AppField name="hideFirstNodes">{({ NumberField }) => <NumberField label="Masquer les N premières étapes" min={0} />}</form.AppField>
        <form.AppField name="hideLastNodes">{({ NumberField }) => <NumberField label="Masquer les N dernières étapes" min={0} />}</form.AppField>
      </div>
    </FormDialog>
  )
}

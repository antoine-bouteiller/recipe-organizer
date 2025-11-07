import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { updateIngredientOptions } from '@/features/ingredients/api/update'
import {
  type IngredientFormInput,
  ingredientFormFields,
  IngredientForm,
} from '@/features/ingredients/ingredient-form'
import type { Ingredient } from '@/types/ingredient'
import { useAppForm } from '@/hooks/use-app-form'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
})

interface EditIngredientProps {
  ingredient: Ingredient
}

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateMutation = useMutation(updateIngredientOptions())

  const initialValues: IngredientFormInput = {
    name: ingredient.name,
    category: ingredient.category,
  }

  const form = useAppForm({
    validators: {
      onDynamic: ingredientSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async (data) => {
      try {
        const parsedData = ingredientSchema.parse(data.value)

        await updateMutation.mutateAsync({
          data: {
            id: ingredient.id,
            name: parsedData.name,
            category: parsedData.category,
          },
        })

        setIsOpen(false)
      } catch (error) {
        toast.error("Une erreur est survenue lors de la modification de l'ingrédient", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger render={<Button variant="outline" size="sm" />}>
        <PencilSimpleIcon />
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Modifier l&apos;ingrédient</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <IngredientForm form={form} fields={ingredientFormFields} ingredient={ingredient} />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={form.state.isSubmitting}
            >
              Annuler
            </Button>
            <form.AppForm>
              <form.FormSubmit label="Mettre à jour" />
            </form.AppForm>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

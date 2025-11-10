import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { updateIngredientOptions } from '@/features/ingredients/api/update'
import {
  IngredientForm,
  type IngredientFormInput,
  ingredientFormFields,
  ingredientFormSchema,
} from '@/features/ingredients/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import type { Ingredient } from '@/types/ingredient'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

interface EditIngredientProps {
  ingredient: Ingredient
}

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateMutation = useMutation(updateIngredientOptions())

  const initialValues: IngredientFormInput = {
    name: ingredient.name,
    category: ingredient.category,
    parentId: ingredient.parentId ? ingredient.parentId.toString() : undefined,
    factor: ingredient.factor ?? undefined,
  }

  const form = useAppForm({
    validators: {
      onDynamic: ingredientFormSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async (data) => {
      try {
        const parsedData = ingredientFormSchema.parse(data.value)

        await updateMutation.mutateAsync({
          data: {
            id: ingredient.id,
            name: parsedData.name,
            category: parsedData.category,
            parentId: parsedData.parentId ? Number.parseInt(parsedData.parentId) : null,
            factor: parsedData.factor ?? null,
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
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Modifier l&apos;ingrédient</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <IngredientForm form={form} fields={ingredientFormFields} ingredient={ingredient} />
          </div>
          <ResponsiveDialogFooter>
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
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </form>
    </ResponsiveDialog>
  )
}

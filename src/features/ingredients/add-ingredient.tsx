import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { createIngredientOptions, ingredientSchema } from '@/features/ingredients/api/create'
import {
  ingredientDefaultValues,
  IngredientForm,
  ingredientFormFields,
} from '@/features/ingredients/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState, type JSX } from 'react'
import { toast } from 'sonner'

interface AddIngredientProps {
  defaultValue?: string
  onSuccess?: () => void
  children: JSX.Element
}

export const AddIngredient = ({ defaultValue, onSuccess, children }: AddIngredientProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useMutation(createIngredientOptions())

  const form = useAppForm({
    validators: {
      onDynamic: ingredientSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: {
      ...ingredientDefaultValues,
      name: defaultValue ?? ingredientDefaultValues.name,
    },
    onSubmit: async (data) => {
      try {
        const parsedData = ingredientSchema.parse(data.value)

        await createMutation.mutateAsync({
          data: {
            name: parsedData.name,
            category: parsedData.category,
          },
        })

        setIsOpen(false)
        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'ingrédient", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <ResponsiveDialog key={defaultValue} open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger render={children} />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Ajouter un ingrédient</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <IngredientForm form={form} fields={ingredientFormFields} />
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
              <form.FormSubmit label="Ajouter" />
            </form.AppForm>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </form>
    </ResponsiveDialog>
  )
}

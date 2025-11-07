import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { createIngredientOptions } from '@/features/ingredients/api/add-one'
import {
  ingredientDefaultValues,
  ingredientFormFields,
  IngredientForm,
} from '@/features/ingredients/ingredient-form'
import { useAppForm } from '@/hooks/use-app-form'
import { PlusIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
})

interface AddIngredientProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialName?: string
  onSuccess?: () => void
}

export const AddIngredient = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialName,
  onSuccess,
}: AddIngredientProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const createMutation = useMutation(createIngredientOptions())

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = isControlled ? controlledOnOpenChange! : setInternalOpen

  const form = useAppForm({
    validators: {
      onDynamic: ingredientSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: ingredientDefaultValues,
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

  // Update form when initialName changes
  useEffect(() => {
    if (isOpen && initialName) {
      form.setFieldValue('name', initialName)
    }
  }, [isOpen, initialName, form])

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <ResponsiveDialogTrigger render={<Button variant="default" size="sm" />}>
          <PlusIcon />
        </ResponsiveDialogTrigger>
      )}
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Ajouter un ingrédient</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <IngredientForm form={form} fields={ingredientFormFields} />
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
              <form.FormSubmit label="Ajouter" />
            </form.AppForm>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

import { ingredientFormFields, IngredientForm } from '@/features/ingredients/ingredient-form'
import { useIngredientForm } from '@/features/ingredients/use-ingredient-form'

interface IngredientFormContentProps {
  defaultValue?: string
  onSuccess?: () => void
}

export const IngredientFormContent = ({ defaultValue, onSuccess }: IngredientFormContentProps) => {
  const form = useIngredientForm({ defaultValue, onSuccess })

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Ajouter un ingrédient</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <IngredientForm form={form} fields={ingredientFormFields} />
        <div className="flex gap-2 justify-end">
          <form.AppForm>
            <form.FormSubmit label="Ajouter" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}

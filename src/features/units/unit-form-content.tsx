import { unitFormFields, UnitForm } from '@/features/units/unit-form'
import { useUnitForm } from '@/features/units/use-unit-form'

interface UnitFormContentProps {
  defaultValue?: string
  onSuccess?: () => void
}

export const UnitFormContent = ({ defaultValue, onSuccess }: UnitFormContentProps) => {
  const form = useUnitForm({ defaultValue, onSuccess })

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Ajouter une unité</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <UnitForm form={form} fields={unitFormFields} />
        <div className="flex gap-2 justify-end">
          <form.AppForm>
            <form.FormSubmit label="Ajouter" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}

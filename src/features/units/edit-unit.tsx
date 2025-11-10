import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { type Unit } from '@/features/units/api/get-all'
import { updateUnitOptions } from '@/features/units/api/update'
import {
  UnitForm,
  type UnitFormInput,
  unitFormFields,
  unitFormSchema,
} from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

interface EditUnitProps {
  unit: Unit
}

export const EditUnit = ({ unit }: EditUnitProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateMutation = useMutation(updateUnitOptions())

  const initialValues: UnitFormInput = {
    name: unit.name,
    symbol: unit.symbol,
    parentId: unit.parentId?.toString() ?? undefined,
    factor: unit.factor ?? undefined,
  }

  const form = useAppForm({
    validators: {
      onDynamic: unitFormSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialValues,
    onSubmit: async (data) => {
      try {
        const parsedData = unitFormSchema.parse(data.value)

        await updateMutation.mutateAsync({
          data: {
            id: unit.id,
            name: parsedData.name,
            symbol: parsedData.symbol,
            parentId:
              parsedData.parentId && parsedData.parentId !== ''
                ? Number(parsedData.parentId)
                : undefined,
            factor: parsedData.factor ?? undefined,
          },
        })

        setIsOpen(false)
      } catch (error) {
        toast.error("Une erreur est survenue lors de la modification de l'unité", {
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
            <ResponsiveDialogTitle>Modifier l&apos;unité</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <div className="flex flex-col gap-4 px-4 md:px-0">
            <UnitForm form={form} fields={unitFormFields} unit={unit} />
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

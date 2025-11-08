import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { createUnitOptions } from '@/features/units/api/add-one'
import { unitDefaultValues, unitFormFields, UnitForm } from '@/features/units/unit-form'
import { useAppForm } from '@/hooks/use-app-form'
import { noop } from '@/lib/utils'
import { PlusIcon } from '@phosphor-icons/react'
import { revalidateLogic } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const unitSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  symbol: z.string().min(1, 'Le symbole est requis'),
  parentId: z.string().nullish(),
  factor: z.number().positive('Le facteur doit être positif').nullish(),
})

interface AddUnitProps {
  defaultValue?: string
  onSuccess?: () => void
  children?: ReactNode
}

export const AddUnit = ({ defaultValue, onSuccess, children }: AddUnitProps = {}) => {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useMutation(createUnitOptions())

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = isControlled ? (controlledOnOpenChange ?? noop) : setInternalOpen

  const form = useAppForm({
    validators: {
      onDynamic: unitSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: {
      ...unitDefaultValues,
      symbol: defaultValue ?? unitDefaultValues.symbol,
    },
    onSubmit: async (data) => {
      try {
        const parsedData = unitSchema.parse(data.value)

        await createMutation.mutateAsync({
          data: {
            name: parsedData.name,
            symbol: parsedData.symbol,
            parentId: parsedData.parentId && parsedData.parentId !== ''
              ? Number(parsedData.parentId)
              : undefined,
            factor: parsedData.factor ?? undefined,
          },
        })

        setIsOpen(false)
        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error("Une erreur est survenue lors de la création de l'unité", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        })
      }
    },
  })

  return (
    <ResponsiveDialog key={defaultValue} open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <ResponsiveDialogTrigger>{children}</ResponsiveDialogTrigger>
      ) : (
        <ResponsiveDialogTrigger render={<Button variant="default" size="sm" />}>
          <PlusIcon />
        </ResponsiveDialogTrigger>
      )}
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Ajouter une unité</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="px-4 md:px-0">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <UnitForm form={form} fields={unitFormFields} />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={form.state.isSubmitting}>
                Annuler
              </Button>
              <form.AppForm>
                <form.FormSubmit label="Ajouter" />
              </form.AppForm>
            </div>
          </form>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

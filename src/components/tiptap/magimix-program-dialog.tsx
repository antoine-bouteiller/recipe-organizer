import {
  magimixProgram,
  magimixProgramLabels,
  type MagimixProgramData,
} from '@/components/tiptap/types/magimix'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog'
import { useAppForm } from '@/hooks/use-app-form'
import { formatFormErrors } from '@/utils/format-form-errors'
import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import z from 'zod'
import type { DialogTrigger } from '../ui/dialog'

interface MagimixProgramDialogProps {
  title: string
  submitLabel: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
  onSubmit: (data: MagimixProgramData) => void
  initialData?: MagimixProgramFormInput
  children: ReactNode
}

export const magimixProgramSchema = z.discriminatedUnion('timeType', [
  z.object({
    program: z.enum(magimixProgram),
    timeType: z.literal('auto'),
    temperature: z.int().min(0).max(200).optional(),
  }),
  z.object({
    program: z.enum(magimixProgram),
    timeType: z.literal('manual'),
    timeMinutes: z.int().min(0),
    timeSeconds: z.int().min(0).max(59),
    temperature: z.int().min(0).max(200).optional(),
  }),
])

export type MagimixProgramFormInput = z.input<typeof magimixProgramSchema>

export const magimixProgramDefaultValues: MagimixProgramFormInput = {
  program: 'expert',
  timeType: 'auto',
  temperature: undefined,
}

const programItems = Object.entries(magimixProgramLabels).map(([value, label]) => ({
  value,
  label,
}))

const timeTypeItems = [
  { value: 'auto', label: 'Automatique' },
  { value: 'manual', label: 'Manuel' },
]

export const MagimixProgramDialog = ({
  title,
  submitLabel,
  initialData,
  children,
  onSubmit,
  triggerRender,
}: MagimixProgramDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    validators: {
      onDynamic: magimixProgramSchema,
    },
    validationLogic: revalidateLogic(),
    defaultValues: initialData ?? magimixProgramDefaultValues,
    onSubmit: async ({ value }) => {
      const parsedValue = magimixProgramSchema.parse(value)

      const time: 'auto' | number =
        parsedValue.timeType === 'auto'
          ? 'auto'
          : parsedValue.timeMinutes * 60 + parsedValue.timeSeconds

      const programData: MagimixProgramData = {
        program: value.program,
        time,
        temperature: value.temperature ?? undefined,
      }
      onSubmit(programData)
      form.reset()
      setOpen(false)
    },
  })

  const { errors, isSubmitting } = useStore(form.store, (state) => ({
    errors: formatFormErrors(state.errors),
    isSubmitting: state.isSubmitting,
  }))

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger render={triggerRender}>{children}</ResponsiveDialogTrigger>

      <ResponsiveDialogContent>
        <Form
          onSubmit={async (event) => {
            event.preventDefault()
            event.stopPropagation()
            await form.handleSubmit()
          }}
          errors={errors}
        >
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <div className="flex flex-col gap-2 px-4 md:px-0 md:py-4">
            <form.AppField name="program">
              {({ SelectField }) => (
                <SelectField label="Programme" items={programItems} disabled={isSubmitting} />
              )}
            </form.AppField>

            <form.AppField name="timeType">
              {({ SelectField, state }) => (
                <>
                  <SelectField label="Durée" items={timeTypeItems} disabled={isSubmitting} />

                  {state.value === 'manual' && (
                    <div className="flex gap-2">
                      <form.AppField name="timeMinutes">
                        {({ NumberField }) => (
                          <NumberField
                            label="Minutes"
                            min={0}
                            disabled={isSubmitting}
                            decimalScale={0}
                          />
                        )}
                      </form.AppField>
                      <form.AppField name="timeSeconds">
                        {({ NumberField }) => (
                          <NumberField
                            label="Secondes"
                            min={0}
                            max={59}
                            disabled={isSubmitting}
                            decimalScale={0}
                          />
                        )}
                      </form.AppField>
                    </div>
                  )}
                </>
              )}
            </form.AppField>

            <form.AppField name="temperature">
              {({ NumberField }) => (
                <NumberField
                  label="Température (°C) - Optionnel"
                  placeholder="Ex: 100"
                  min={0}
                  max={200}
                  disabled={isSubmitting}
                  decimalScale={0}
                />
              )}
            </form.AppField>
          </div>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose render={<Button variant="outline" disabled={isSubmitting} />}>
              Annuler
            </ResponsiveDialogClose>
            <form.AppForm>
              <form.FormSubmit label={submitLabel} />
            </form.AppForm>
          </ResponsiveDialogFooter>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

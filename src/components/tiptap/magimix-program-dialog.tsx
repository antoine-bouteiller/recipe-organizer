import { revalidateLogic, useStore } from '@tanstack/react-form'
import { type } from 'arktype'
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'

import { allowedRotationSpeed, magimixProgram, type MagimixProgramData, magimixProgramLabels } from '@/components/tiptap/types/magimix'
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
import { capitalize } from '@/utils/string'

import type { DialogTrigger } from '../ui/dialog'

interface MagimixProgramDialogProps {
  children: ReactNode
  initialData?: MagimixProgramFormInput
  onSubmit: (data: MagimixProgramData) => void
  submitLabel: string
  title: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

export const magimixProgramSchema = type({
  program: type.enumerated(...magimixProgram),
  rotationSpeed: type.enumerated(...allowedRotationSpeed),
  'temperature?': '0 < number < 200',
  timeMinutes: '0 <= number < 60',
  timeSeconds: '0 <= number < 60',
})

export type MagimixProgramFormInput = typeof magimixProgramSchema.infer

export const magimixProgramDefaultValues: MagimixProgramFormInput = {
  program: 'expert',
  rotationSpeed: 'auto',
  temperature: undefined,
  timeMinutes: 0,
  timeSeconds: 0,
}

const programItems = Object.entries(magimixProgramLabels).map(([value, label]) => ({
  label,
  value,
}))

export const MagimixProgramDialog = ({ children, initialData, onSubmit, submitLabel, title, triggerRender }: MagimixProgramDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: initialData ?? magimixProgramDefaultValues,
    onSubmit: async ({ value }) => {
      const validated = magimixProgramSchema.assert(value)

      const time = validated.timeMinutes * 60 + validated.timeSeconds

      onSubmit({
        program: validated.program,
        rotationSpeed: validated.rotationSpeed,
        temperature: validated.temperature,
        time,
      })
      form.reset()
      setOpen(false)
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: (value) => {
        const validated = magimixProgramSchema(value)
        if (validated instanceof type.errors) {
          return validated.summary
        }
        return undefined
      },
    },
  })

  const { errors, isSubmitting } = useStore(form.store, (state) => ({
    errors: formatFormErrors(state.errors),
    isSubmitting: state.isSubmitting,
  }))

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      <ResponsiveDialogTrigger render={triggerRender}>{children}</ResponsiveDialogTrigger>

      <ResponsiveDialogContent>
        <Form
          errors={errors}
          onSubmit={async (event) => {
            event.preventDefault()
            event.stopPropagation()
            await form.handleSubmit()
          }}
        >
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <div
            className={`
              flex flex-col gap-2 px-4
              md:px-0 md:py-4
            `}
          >
            <form.AppField name="program">
              {({ SelectField }) => <SelectField disabled={isSubmitting} items={programItems} label="Programme" />}
            </form.AppField>

            <form.AppField name="timeMinutes">
              {({ NumberField }) => <NumberField decimalScale={0} disabled={isSubmitting} label="Minutes*" min={0} />}
            </form.AppField>
            <form.AppField name="timeSeconds">
              {({ NumberField }) => <NumberField decimalScale={0} disabled={isSubmitting} label="Secondes*" max={59} min={0} />}
            </form.AppField>

            <form.AppField name="rotationSpeed">
              {({ SelectField }) => (
                <SelectField
                  disabled={isSubmitting}
                  items={allowedRotationSpeed.map((speed) => ({
                    label: capitalize(speed),
                    value: speed,
                  }))}
                  label="Vitesse de rotation*"
                />
              )}
            </form.AppField>

            <form.AppField name="temperature">
              {({ NumberField }) => (
                <NumberField decimalScale={0} disabled={isSubmitting} label="Température (°C) - Optionnel" max={200} min={0} placeholder="Ex: 100" />
              )}
            </form.AppField>
          </div>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose render={<Button disabled={isSubmitting} variant="outline" />}>Annuler</ResponsiveDialogClose>
            <form.AppForm>
              <form.FormSubmit label={submitLabel} />
            </form.AppForm>
          </ResponsiveDialogFooter>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

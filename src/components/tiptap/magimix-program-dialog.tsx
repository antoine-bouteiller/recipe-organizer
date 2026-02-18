import { revalidateLogic, useStore } from '@tanstack/react-form'
import { useState, type ComponentPropsWithoutRef } from 'react'
import * as v from 'valibot'

import { allowedRotationSpeed, magimixProgram, magimixProgramLabels, type MagimixProgramData } from '@/components/tiptap/types/magimix'
import { useAppForm } from '@/hooks/use-app-form'
import { capitalize } from '@/utils/string'

import type { DialogTrigger } from '../ui/dialog'

import { getFormDialog } from '../dialogs/form-dialog'

interface MagimixProgramDialogProps {
  initialData?: MagimixProgramFormInput
  onSubmit: (data: MagimixProgramData) => void
  submitLabel: string
  title: string
  triggerRender?: ComponentPropsWithoutRef<typeof DialogTrigger>['render']
}

const magimixProgramSchema = v.object({
  program: v.picklist([...magimixProgram]),
  rotationSpeed: v.picklist([...allowedRotationSpeed]),
  temperature: v.optional(
    v.pipe(
      v.number(),
      v.check((n) => n > 0 && n < 200)
    )
  ),
  timeMinutes: v.pipe(
    v.number(),
    v.minValue(0),
    v.check((n) => n < 60)
  ),
  timeSeconds: v.pipe(
    v.number(),
    v.minValue(0),
    v.check((n) => n < 60)
  ),
})

export type MagimixProgramFormInput = v.InferOutput<typeof magimixProgramSchema>

const magimixProgramDefaultValues: MagimixProgramFormInput = {
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

export const MagimixProgramDialog = ({ initialData, onSubmit, submitLabel, title, triggerRender }: MagimixProgramDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: initialData ?? magimixProgramDefaultValues,
    onSubmit: async ({ value }) => {
      const validated = v.parse(magimixProgramSchema, value)

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
      onDynamic: magimixProgramSchema,
    },
  })

  const FormDialog = getFormDialog(magimixProgramDefaultValues)

  const { isSubmitting } = useStore(form.store, (state) => ({
    isSubmitting: state.isSubmitting,
  }))

  return (
    <FormDialog form={form} trigger={triggerRender} open={open} setOpen={setOpen} submitLabel={submitLabel} title={title}>
      <form.AppField name="program">
        {({ SelectField }) => <SelectField disabled={isSubmitting} items={programItems} label="Programme" />}
      </form.AppField>
      <form.AppField name="timeMinutes">{({ NumberField }) => <NumberField disabled={isSubmitting} label="Minutes*" min={0} />}</form.AppField>
      <form.AppField name="timeSeconds">
        {({ NumberField }) => <NumberField disabled={isSubmitting} label="Secondes*" max={59} min={0} />}
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
        {({ NumberField }) => <NumberField disabled={isSubmitting} label="Température (°C) - Optionnel" max={200} min={0} placeholder="Ex: 100" />}
      </form.AppField>
    </FormDialog>
  )
}

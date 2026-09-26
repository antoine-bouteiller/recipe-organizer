import { capitalize } from '@client/utils/string'
import { getFormDialog } from '@recipe-organizer/design-system/form-dialog'
import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { allowedRotationSpeed, magimixProgram, magimixProgramLabels } from '@recipe-organizer/shared/recipe/magimix'
import type { MagimixProgramData } from '@recipe-organizer/shared/recipe/magimix'
import { revalidateLogic } from '@tanstack/react-form'
import { useSelector } from '@tanstack/react-store'
import { useState } from 'react'
import type { ReactElement } from 'react'
import * as z from 'zod'

interface MagimixStepDialogProps {
  initialData?: MagimixProgramData
  onSubmit: (data: MagimixProgramData) => void
  submitLabel: string
  title: string
  triggerRender?: ReactElement
}

const magimixProgramSchema = z.object({
  program: z.enum([...magimixProgram]),
  rotationSpeed: z.enum([...allowedRotationSpeed]),
  temperature: z.number().min(0).max(200).optional(),
  timeMinutes: z.number().min(0).max(60),
  timeSeconds: z.number().min(0).max(60),
})

type MagimixProgramFormInput = z.infer<typeof magimixProgramSchema>

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

const FormDialog = getFormDialog(magimixProgramDefaultValues)

export const MagimixStepDialog = ({ initialData, onSubmit, submitLabel, title, triggerRender }: MagimixStepDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useAppForm({
    defaultValues: initialData
      ? {
          program: initialData.program,
          rotationSpeed: initialData.rotationSpeed,
          temperature: initialData.temperature,
          timeMinutes: Math.floor(initialData.time / 60),
          timeSeconds: initialData.time % 60,
        }
      : magimixProgramDefaultValues,
    onSubmit: async ({ value }) => {
      const validated = magimixProgramSchema.parse(value)

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

  const { isSubmitting } = useSelector(form.store, (state) => ({
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

import { revalidateLogic } from '@tanstack/solid-form'
import { useSelector } from '@tanstack/solid-store'
import { createSignal } from 'solid-js'
import * as v from 'valibot'

import { getFormDialog } from '@/components/dialogs/form-dialog'
import { type TriggerRender } from '@/components/ui/dialog'
import { allowedRotationSpeed, magimixProgram, magimixProgramLabels, type MagimixProgramData } from '@/features/recipe/types/magimix'
import { useAppForm } from '@/hooks/use-app-form'
import { capitalize } from '@/utils/string'

interface MagimixProgramDialogProps {
  initialData?: MagimixProgramFormInput
  onSubmit: (data: MagimixProgramData) => void
  submitLabel: string
  title: string
  trigger?: TriggerRender
}

const magimixProgramSchema = v.object({
  program: v.picklist([...magimixProgram]),
  rotationSpeed: v.picklist([...allowedRotationSpeed]),
  temperature: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(200))),
  timeMinutes: v.pipe(v.number(), v.minValue(0), v.maxValue(60)),
  timeSeconds: v.pipe(v.number(), v.minValue(0), v.maxValue(60)),
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

const FormDialog = getFormDialog(magimixProgramDefaultValues)

export const MagimixProgramDialog = (props: MagimixProgramDialogProps) => {
  const [open, setOpen] = createSignal(false)

  const form = useAppForm(() => ({
    defaultValues: props.initialData ?? magimixProgramDefaultValues,
    onSubmit: async ({ value }) => {
      const validated = v.parse(magimixProgramSchema, value)

      const time = validated.timeMinutes * 60 + validated.timeSeconds

      props.onSubmit({
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
  }))

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <FormDialog form={form} open={open()} setOpen={setOpen} submitLabel={props.submitLabel} title={props.title} trigger={props.trigger}>
      <form.AppField name="program">
        {({ SelectField }) => <SelectField disabled={isSubmitting()} items={programItems} label="Programme" />}
      </form.AppField>
      <form.AppField name="timeMinutes">{({ NumberField }) => <NumberField disabled={isSubmitting()} label="Minutes*" min={0} />}</form.AppField>
      <form.AppField name="timeSeconds">
        {({ NumberField }) => <NumberField disabled={isSubmitting()} label="Secondes*" max={59} min={0} />}
      </form.AppField>
      <form.AppField name="rotationSpeed">
        {({ SelectField }) => (
          <SelectField
            disabled={isSubmitting()}
            items={allowedRotationSpeed.map((speed) => ({
              label: capitalize(speed),
              value: speed,
            }))}
            label="Vitesse de rotation*"
          />
        )}
      </form.AppField>
      <form.AppField name="temperature">
        {({ NumberField }) => <NumberField disabled={isSubmitting()} label="Température (°C) - Optionnel" max={200} min={0} placeholder="Ex: 100" />}
      </form.AppField>
    </FormDialog>
  )
}

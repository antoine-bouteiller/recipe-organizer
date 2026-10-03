import { useState } from 'react'

import { NumberField } from '@/components/ui/forms/number-field/number-field'
import { SelectField } from '@/components/ui/forms/select-field/select-field'
import type { DialogProps } from '@/components/ui/overlays/dialog/dialog'
import { FormDialog } from '@/components/ui/overlays/form-dialog/form-dialog'
import { allowedRotationSpeed, magimixProgram, magimixProgramLabels } from '@/features/recipe/magimix'
import type { MagimixProgramData } from '@/features/recipe/magimix'
import { capitalize } from '@/utils/string'

interface MagimixStepDialogProps {
  initialData?: MagimixProgramData
  onSubmit: (data: MagimixProgramData) => void
  submitLabel: string
  title: string
  renderTrigger?: DialogProps['renderTrigger']
}

interface MagimixProgramFormInput {
  program: MagimixProgramData['program']
  rotationSpeed: MagimixProgramData['rotationSpeed']
  temperature?: number
  timeMinutes: number | undefined
  timeSeconds: number | undefined
}

const magimixProgramDefaultValues: MagimixProgramFormInput = {
  program: 'expert',
  rotationSpeed: 'auto',
  temperature: undefined,
  timeMinutes: 0,
  timeSeconds: 0,
}

const programItems = Object.entries(magimixProgramLabels).map(([value, label]) => ({ label, value }))

export const MagimixStepDialog = ({ initialData, onSubmit, submitLabel, title, renderTrigger }: MagimixStepDialogProps) => {
  const [open, setOpen] = useState(false)
  const defaults = initialData
    ? { ...initialData, timeMinutes: Math.floor(initialData.time / 60), timeSeconds: initialData.time % 60 }
    : magimixProgramDefaultValues
  const [data, setData] = useState<MagimixProgramFormInput>(defaults)
  const update = <TKey extends keyof MagimixProgramFormInput>(key: TKey, value: MagimixProgramFormInput[TKey]) =>
    setData((previous) => ({ ...previous, [key]: value }))
  return (
    <FormDialog
      renderTrigger={renderTrigger}
      open={open}
      setOpen={(next) => {
        if (next) {
          setData(defaults)
        }
        setOpen(next)
      }}
      pending={false}
      submitLabel={submitLabel}
      title={title}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          program: data.program,
          rotationSpeed: data.rotationSpeed,
          temperature: data.temperature,
          time: (data.timeMinutes ?? 0) * 60 + (data.timeSeconds ?? 0),
        })
        setOpen(false)
      }}
    >
      <SelectField
        name="program"
        value={data.program}
        onChange={(value) => update('program', magimixProgram.find((program) => program === value) ?? 'expert')}
        items={programItems}
        label="Programme"
      />
      <NumberField name="timeMinutes" value={data.timeMinutes} onChange={(value) => update('timeMinutes', value)} label="Minutes*" min={0} max={60} />
      <NumberField
        name="timeSeconds"
        value={data.timeSeconds}
        onChange={(value) => update('timeSeconds', value)}
        label="Secondes*"
        max={59}
        min={0}
      />
      <SelectField
        name="rotationSpeed"
        value={data.rotationSpeed}
        onChange={(value) => update('rotationSpeed', allowedRotationSpeed.find((speed) => speed === value) ?? 'auto')}
        items={allowedRotationSpeed.map((speed) => ({ label: capitalize(speed), value: speed }))}
        label="Vitesse de rotation*"
      />
      <NumberField
        name="temperature"
        value={data.temperature}
        onChange={(value) => update('temperature', value)}
        label="Température (°C) - Optionnel"
        max={200}
        min={0}
        placeholder="Ex: 100"
      />
    </FormDialog>
  )
}

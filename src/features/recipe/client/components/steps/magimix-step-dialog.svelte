<script lang="ts">
  import NumberField from '@/components/ui/forms/number-field/number-field.svelte'
  import SelectField from '@/components/ui/forms/select-field/select-field.svelte'
  import FormDialog from '@/components/ui/overlays/form-dialog/form-dialog.svelte'
  import type { FormDialogProps } from '@/components/ui/overlays/form-dialog/form-dialog.svelte'
  import { allowedRotationSpeed, magimixProgram, magimixProgramLabels } from '@/features/recipe/magimix'
  import type { MagimixProgramData } from '@/features/recipe/magimix'
  import { capitalize } from '@/utils/string'

  interface Input {
    program: MagimixProgramData['program']
    rotationSpeed: MagimixProgramData['rotationSpeed']
    temperature?: number
    timeMinutes?: number
    timeSeconds?: number
  }
  const {
    initialData,
    onSubmit,
    submitLabel,
    title,
    renderTrigger,
  }: {
    initialData?: MagimixProgramData
    onSubmit: (value: MagimixProgramData) => void
    submitLabel: string
    title: string
    renderTrigger?: FormDialogProps['renderTrigger']
  } = $props()
  let open = $state(false)
  const defaults = (): Input =>
    initialData
      ? { ...initialData, timeMinutes: Math.floor(initialData.time / 60), timeSeconds: initialData.time % 60 }
      : { program: 'expert', rotationSpeed: 'auto', timeMinutes: 0, timeSeconds: 0 }
  let data = $state<Input>({ program: 'expert', rotationSpeed: 'auto', timeMinutes: 0, timeSeconds: 0 })
  const setOpen = (next: boolean) => {
    if (next) {
      data = defaults()
    }
    open = next
  }
  const programItems = Object.entries(magimixProgramLabels).map(([value, label]) => ({ label, value }))
</script>

<FormDialog
  {renderTrigger}
  {open}
  {setOpen}
  pending={false}
  {submitLabel}
  {title}
  onsubmit={(event) => {
    event.preventDefault()
    onSubmit({
      program: data.program,
      rotationSpeed: data.rotationSpeed,
      temperature: data.temperature,
      time: (data.timeMinutes ?? 0) * 60 + (data.timeSeconds ?? 0),
    })
    open = false
  }}
>
  <SelectField
    name="program"
    value={data.program}
    onChange={(value) => {
      data.program = magimixProgram.find((program) => program === value) ?? 'expert'
    }}
    items={programItems}
    label="Programme"
  />
  <NumberField
    name="timeMinutes"
    value={data.timeMinutes}
    onChange={(value) => {
      data.timeMinutes = value
    }}
    label="Minutes*"
    min={0}
    max={60}
  />
  <NumberField
    name="timeSeconds"
    value={data.timeSeconds}
    onChange={(value) => {
      data.timeSeconds = value
    }}
    label="Secondes*"
    min={0}
    max={59}
  />
  <SelectField
    name="rotationSpeed"
    value={data.rotationSpeed}
    onChange={(value) => {
      data.rotationSpeed = allowedRotationSpeed.find((speed) => speed === value) ?? 'auto'
    }}
    items={allowedRotationSpeed.map((speed) => ({ label: capitalize(speed), value: speed }))}
    label="Vitesse de rotation*"
  />
  <NumberField
    name="temperature"
    value={data.temperature}
    onChange={(value) => {
      data.temperature = value
    }}
    label="Température (°C) - Optionnel"
    min={0}
    max={200}
    placeholder="Ex: 100"
  />
</FormDialog>

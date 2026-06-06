import { FieldControl, FieldDescription, FieldError, FieldLabel, Field as FieldRoot } from '@/components/ui/field'

const Field = Object.assign(FieldRoot, {
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Label: FieldLabel,
})

export { Field }

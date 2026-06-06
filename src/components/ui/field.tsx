import { FieldControl, FieldDescription, FieldError, FieldLabel, Field as FieldRoot } from './primitive/field'

const Field = Object.assign(FieldRoot, {
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Label: FieldLabel,
})

export { Field }

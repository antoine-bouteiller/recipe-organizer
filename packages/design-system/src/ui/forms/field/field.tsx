import { Field as FieldPrimitive } from '@base-ui/react/field'
import type React from 'react'

import * as styles from './field.css'

type FieldProps = Pick<FieldPrimitive.Root.Props, 'children' | 'dirty' | 'disabled' | 'invalid' | 'name' | 'touched'>
type FieldLabelProps = Pick<FieldPrimitive.Label.Props, 'children'> & {
  presentation?: 'dropzone-image' | 'dropzone-video'
}
type FieldErrorProps = Pick<FieldPrimitive.Error.Props, 'children' | 'match'>
type FieldControlProps = Pick<FieldPrimitive.Control.Props, 'required'>

export const Field = ({ children, dirty, disabled, invalid, name, touched }: FieldProps): React.ReactElement => (
  <FieldPrimitive.Root className={styles.field} data-slot="field" dirty={dirty} disabled={disabled} invalid={invalid} name={name} touched={touched}>
    {children}
  </FieldPrimitive.Root>
)
export const FieldLabel = ({ children, presentation }: FieldLabelProps): React.ReactElement => (
  <FieldPrimitive.Label className={styles.label({ presentation })} data-slot="field-label">
    {children}
  </FieldPrimitive.Label>
)
export const FieldError = ({ children, match }: FieldErrorProps): React.ReactElement => (
  <FieldPrimitive.Error className={styles.error} data-slot="field-error" match={match}>
    {children}
  </FieldPrimitive.Error>
)
export const FieldControl = ({ required }: FieldControlProps): React.ReactElement => (
  <FieldPrimitive.Control data-slot="field-control" required={required} />
)

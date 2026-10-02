import { createContext, use } from 'react'
import type React from 'react'

import { FormErrorsContext } from '../form/form'

import * as styles from './field.css'

type FieldProps = Pick<React.ComponentProps<'div'>, 'children'> & { invalid?: boolean; name?: string }
type FieldLabelProps = Pick<React.ComponentProps<'label'>, 'children' | 'htmlFor'> & {
  presentation?: 'dropzone-image' | 'dropzone-video'
}
type FieldErrorProps = Pick<React.ComponentProps<'div'>, 'children'>

const FieldContext = createContext<{ error?: string; invalid: boolean }>({ invalid: false })

export const Field = ({ children, invalid, name }: FieldProps): React.ReactElement => {
  const error = name ? use(FormErrorsContext)[name] : undefined
  const isInvalid = Boolean(invalid || error)

  return (
    <div className={styles.field} data-invalid={isInvalid || undefined} data-slot="field">
      <FieldContext value={{ error, invalid: isInvalid }}>{children}</FieldContext>
    </div>
  )
}
export const FieldLabel = ({ children, htmlFor, presentation }: FieldLabelProps): React.ReactElement => (
  <label className={styles.label({ presentation })} data-invalid={use(FieldContext).invalid || undefined} data-slot="field-label" htmlFor={htmlFor}>
    {children}
  </label>
)
export const FieldError = ({ children }: FieldErrorProps): React.ReactElement | null => {
  const { error, invalid } = use(FieldContext)
  const message = children ?? error

  return invalid && message ? (
    <div className={styles.error} data-slot="field-error">
      {message}
    </div>
  ) : null
}

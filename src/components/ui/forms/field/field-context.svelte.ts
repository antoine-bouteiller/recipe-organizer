import { getContext, setContext } from 'svelte'

import { useFormErrors } from '../form/form-context.svelte'

const fieldContext = Symbol('field')
export interface FieldState {
  readonly error?: string
  readonly invalid: boolean
}
export const provideField = (field: FieldState): FieldState => setContext(fieldContext, field)
export const useField = (): FieldState => getContext<FieldState>(fieldContext) ?? { invalid: false }
export const useFieldInvalid = (name: string | (() => string)): (() => boolean) => {
  const form = useFormErrors()
  return () => Boolean(form.errors[typeof name === 'function' ? name() : name])
}

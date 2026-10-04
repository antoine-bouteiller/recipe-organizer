import { getContext, setContext } from 'svelte'

const FormErrorsContext = Symbol('form-errors')
export interface FormErrors {
  readonly errors: Record<string, string>
}
const noErrors: Record<string, string> = {}
export const provideFormErrors = (errors: () => Record<string, string> | undefined): FormErrors =>
  setContext(FormErrorsContext, {
    get errors() {
      return errors() ?? noErrors
    },
  })
export const useFormErrors = (): FormErrors => getContext<FormErrors>(FormErrorsContext) ?? { errors: noErrors }

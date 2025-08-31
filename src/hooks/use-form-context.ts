import { createFormHookContexts, useStore } from '@tanstack/react-form'
import { createContext, useContext } from 'react'

interface FormItemContextValue {
  id: string
}

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

const {
  fieldContext,
  formContext,
  useFieldContext: useFormFieldContext,
  useFormContext,
} = createFormHookContexts()

const useFieldContext = <T>() => {
  const { id } = useContext(FormItemContext)
  const { name, store, state, ...fieldContext } = useFormFieldContext<T>()

  const errors = useStore(store, (state) => state.meta.errors)
  if (!fieldContext) {
    throw new Error('useFieldContext should be used within <FormItem>')
  }

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    errors,
    store,
    state,
    ...fieldContext,
  }
}

export { fieldContext, formContext, useFormContext, useFieldContext, useFormFieldContext }

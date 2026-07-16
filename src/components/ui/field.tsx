import { type ComponentProps, createContext, Show, splitProps, useContext } from 'solid-js'

import { FormErrorsContext } from '@/components/ui/form'
import { cn } from '@/utils/cn'

interface FieldState {
  dirty: () => boolean
  error: () => string | undefined
  invalid: () => boolean
  touched: () => boolean
}

const FieldContext = createContext<FieldState>({
  dirty: () => false,
  error: () => undefined,
  invalid: () => false,
  touched: () => false,
})

const useFieldState = () => useContext(FieldContext)

const stateDataAttrs = (state: FieldState) => ({
  get 'data-dirty'() {
    return state.dirty() || undefined
  },
  get 'data-invalid'() {
    return state.invalid() || undefined
  },
  get 'data-touched'() {
    return state.touched() || undefined
  },
})

export const Field = (props: ComponentProps<'div'> & { name?: string; invalid?: boolean; dirty?: boolean; touched?: boolean }) => {
  const [local, rest] = splitProps(props, ['class', 'name', 'invalid', 'dirty', 'touched', 'children'])
  const formErrors = useContext(FormErrorsContext)

  const state: FieldState = {
    dirty: () => Boolean(local.dirty),
    error: () => (local.name ? formErrors()[local.name] : undefined),
    invalid: () => Boolean(local.invalid),
    touched: () => Boolean(local.touched),
  }

  return (
    <FieldContext.Provider value={state}>
      <div class={cn('flex flex-col items-start gap-2 w-full', local.class)} data-slot="field" {...stateDataAttrs(state)} {...rest}>
        {local.children}
      </div>
    </FieldContext.Provider>
  )
}

export const FieldLabel = (props: ComponentProps<'label'>) => {
  const [local, rest] = splitProps(props, ['class'])
  const state = useFieldState()

  return (
    <label
      class={cn('inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4', local.class)}
      data-slot="field-label"
      {...stateDataAttrs(state)}
      {...rest}
    />
  )
}

export const FieldError = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const state = useFieldState()

  return (
    <Show when={state.error()}>
      {(error) => (
        <div class={cn('text-destructive-foreground text-xs', local.class)} data-slot="field-error" {...rest}>
          {local.children ?? error()}
        </div>
      )}
    </Show>
  )
}

export const FieldControl = (props: ComponentProps<'input'>) => {
  const state = useFieldState()

  return <input aria-invalid={state.invalid() || undefined} data-slot="field-control" {...stateDataAttrs(state)} {...props} />
}

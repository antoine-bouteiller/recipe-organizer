import { type ComponentProps, createContext, splitProps } from 'solid-js'

import { cn } from '@/utils/cn'

export const FormErrorsContext = createContext<() => Record<string, string>>(() => ({}))

export const Form = (props: ComponentProps<'form'> & { errors?: Record<string, string> }) => {
  const [local, rest] = splitProps(props, ['class', 'errors', 'children'])

  return (
    <FormErrorsContext.Provider value={() => local.errors ?? {}}>
      <form class={cn('flex w-full flex-col gap-4', local.class)} data-slot="form" {...rest}>
        {local.children}
      </form>
    </FormErrorsContext.Provider>
  )
}

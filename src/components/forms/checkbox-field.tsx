import { Checkbox as CheckboxPrimitive } from '@kobalte/core/checkbox'
import { Show } from 'solid-js'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/use-form-context'

const Checkbox = (props: { checked?: boolean; disabled?: boolean; onChange?: (checked: boolean) => void }) => (
  <CheckboxPrimitive checked={props.checked} class="inline-flex" disabled={props.disabled} onChange={props.onChange}>
    <CheckboxPrimitive.Input class="peer" />
    <CheckboxPrimitive.Control
      class="relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-[.25rem] border border-input bg-background not-dark:bg-clip-padding text-primary-foreground shadow-xs/5 outline-none transition-shadow data-checked:border-primary data-checked:bg-primary data-disabled:opacity-64 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-background sm:size-4 dark:not-data-checked:bg-input/32"
      data-slot="checkbox"
    >
      <CheckboxPrimitive.Indicator>
        <svg
          aria-hidden="true"
          class="size-3.5 sm:size-3"
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Control>
  </CheckboxPrimitive>
)

interface CheckboxFieldProps {
  class?: string
  disabled?: boolean
  label?: string
}

export const CheckboxField = (props: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>()

  return (
    <Field
      class={props.class}
      dirty={field().state.meta.isDirty}
      invalid={!field().state.meta.isValid}
      name={field().name}
      touched={field().state.meta.isTouched}
    >
      <div class="flex items-center gap-2">
        <Checkbox checked={field().state.value ?? false} disabled={props.disabled} onChange={(checked) => field().handleChange(checked)} />
        <Show when={props.label}>{(label) => <FieldLabel class="cursor-pointer">{label()}</FieldLabel>}</Show>
      </div>
      <FieldError />
    </Field>
  )
}

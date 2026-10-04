<script lang="ts" generics="TValue extends string">
  import Toggle from '@/components/ui/actions/toggle/toggle.svelte'

  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'

  interface ToggleGroupFieldProps {
    name: string
    value: TValue[]
    onChange: (value: TValue[]) => void
    disabled?: boolean
    items: { label: string; value: TValue }[]
    label?: string
  }
  const { name, value: selected, onChange, disabled, items, label }: ToggleGroupFieldProps = $props()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
</script>

<Field {name}>
  {#if label}<span {id}><FieldLabel>{label}</FieldLabel></span>{/if}
  <div class="wrapper">
    <div
      class="group"
      data-slot="toggle-group"
      role="group"
      aria-labelledby={label ? id : undefined}
      aria-describedby={invalid() ? `${id}-error` : undefined}
    >
      {#each items as item (item.value)}<span class="item"
          ><Toggle
            {...{ 'aria-invalid': invalid() || undefined }}
            {disabled}
            onPressedChange={(pressed) => onChange(pressed ? [...selected, item.value] : selected.filter((value) => value !== item.value))}
            pressed={selected.includes(item.value)}>{item.label}</Toggle
          ></span
        >{/each}
    </div>
  </div>
  <FieldError id={`${id}-error`} />
</Field>

<style>
  .wrapper {
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .group {
    display: flex;
    gap: 2px;
    width: fit-content;
    --toggle-hit-min-width: auto;
  }

  .item {
    flex-shrink: 0;
  }
</style>

<script lang="ts" generics="TValue extends number | string | undefined">
  import type { Snippet } from 'svelte'

  import { CheckIcon } from '@/components/ui/data-display/icons'
  import Separator from '@/components/ui/layout/separator/separator.svelte'
  import Popover from '@/components/ui/overlays/popover/popover.svelte'

  import { useFieldInvalid } from '../field/field-context.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Field from '../field/field.svelte'
  import Input from '../input/input.svelte'
  import SelectButton from '../select/select.shared.svelte'
  import type { Option } from './options'

  import * as styles from './combobox-field.css'

  interface ComboboxFieldProps {
    name: string
    value: TValue | undefined
    onChange: (value: TValue | undefined) => void
    addNew?: Snippet<[string]>
    disabled?: boolean
    label?: string
    options: Option<TValue>[]
    placeholder?: string
    searchPlaceholder?: string
  }
  const {
    name,
    value,
    onChange,
    addNew,
    disabled,
    label,
    options,
    placeholder = 'Sélectionner une option',
    searchPlaceholder = 'Rechercher une option',
  }: ComboboxFieldProps = $props()
  const invalid = useFieldInvalid(() => name)
  const id = $props.id()
  let open = $state(false)
  let search = $state('')
  const selectedOption = $derived(options.find((opt) => opt.value === value))
  const filteredOptions = $derived(search ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options)
  const handleOpenChange = (next: boolean) => {
    open = next
    if (!next) {
      search = ''
    }
  }
  const handleSelect = (option: Option<TValue>) => {
    onChange(option.value === value ? undefined : option.value)
    handleOpenChange(false)
  }
</script>

<Field {name}>
  {#if label}<FieldLabel id={`${id}-label`}>{label}</FieldLabel>{/if}
  <Popover onOpenChange={handleOpenChange} {open}>
    {#snippet renderTrigger(props)}<SelectButton
        {...props}
        {id}
        aria-invalid={invalid() || undefined}
        aria-describedby={invalid() ? `${id}-error` : undefined}
        aria-labelledby={label ? `${id}-label ${id}-value` : undefined}
        {disabled}><span id={`${id}-value`}>{selectedOption?.label ?? placeholder}</span></SelectButton
      >{/snippet}
    <div class={styles.column}>
      <Input
        aria-label={searchPlaceholder}
        oninput={(event) => (search = event.currentTarget.value)}
        placeholder={searchPlaceholder}
        value={search}
      />
      <div class={styles.options}>
        {#if filteredOptions.length === 0}<p class={styles.empty}>Aucun résultat</p>{/if}
        {#each filteredOptions as option (String(option.value))}<button class={styles.item} onclick={() => handleSelect(option)} type="button"
            ><span class={styles.truncate}>{option.label}</span>{#if selectedOption?.value === option.value}<span class={styles.icon}
                ><CheckIcon size="sm" /></span
              >{/if}</button
          >{/each}
      </div>
      {#if addNew}<Separator />{@render addNew(search)}{/if}
    </div></Popover
  ><FieldError id={`${id}-error`} />
</Field>

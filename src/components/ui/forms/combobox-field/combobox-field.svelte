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
    <div class="column">
      <Input
        aria-label={searchPlaceholder}
        oninput={(event) => (search = event.currentTarget.value)}
        placeholder={searchPlaceholder}
        value={search}
      />
      <div class="options">
        {#if filteredOptions.length === 0}<p class="empty">Aucun résultat</p>{/if}
        {#each filteredOptions as option (String(option.value))}<button class="item" onclick={() => handleSelect(option)} type="button"
            ><span class="truncate">{option.label}</span>{#if selectedOption?.value === option.value}<span class="icon"><CheckIcon size="sm" /></span
              >{/if}</button
          >{/each}
      </div>
      {#if addNew}<Separator />{@render addNew(search)}{/if}
    </div></Popover
  ><FieldError id={`${id}-error`} />
</Field>

<style>
  .column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  @media screen and (min-width: 768px) {
    .column {
      padding: 0px;
      width: 288px;
    }
  }

  .options {
    display: flex;
    flex-direction: column;
    max-height: 256px;
    overflow-y: auto;
  }

  .empty {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
    padding: 16px;
    text-align: center;
  }

  .item {
    align-items: center;
    border-radius: var(--radius-sm);
    cursor: default;
    display: flex;
    font-size: var(--font-sizes-base);
    gap: 8px;
    justify-content: space-between;
    padding: 4px;
    width: 100%;
  }

  @media (hover: hover) and (pointer: fine) {
    .item:hover {
      background-color: var(--colors-accent);
      color: var(--colors-accent-foreground);
    }
  }

  .item:active {
    background-color: var(--colors-accent);
    color: var(--colors-accent-foreground);
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    flex-shrink: 0;
  }
</style>

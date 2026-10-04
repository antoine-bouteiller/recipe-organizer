<script lang="ts" generics="TValue extends string">
  import { CheckIcon } from '@/components/ui/data-display/icons/svelte'
  import Popover from '@/components/ui/overlays/popover/popover.svelte'
  import { useIsMobile } from '@/hooks/use-is-mobile.svelte'

  import SelectButton from './select.shared.svelte'

  import * as styles from './select.css'
  import * as shared from './select.shared.css'

  interface SelectProps {
    'aria-invalid'?: boolean
    'aria-describedby'?: string
    disabled?: boolean
    id?: string
    items: { label: string; value: TValue | null }[]
    labelId?: string
    onValueChange: (value: TValue | null) => void
    placeholder?: string
    title?: string
    value: TValue | null | undefined
  }
  const {
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby,
    disabled,
    id,
    items,
    labelId,
    onValueChange,
    placeholder = 'Sélectionner',
    title,
    value,
  }: SelectProps = $props()
  const componentId = $props.id()
  const valueId = `${componentId}-value`
  const mobile = useIsMobile()
  let open = $state(false)
  const selected = $derived(items.find((item) => item.value === (value ?? null)))
</script>

<Popover onOpenChange={(next) => (open = next)} {open}>
  {#snippet renderTrigger(props)}<SelectButton
      {...props}
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedby}
      aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
      {disabled}
      {id}><span id={valueId} class={shared.selectTextState[selected ? 'selected' : 'empty']}>{selected?.label ?? placeholder}</span></SelectButton
    >{/snippet}
  <div class={styles.content}>
    {#if mobile.current}<h2 class={styles.title}>{title ?? placeholder}</h2>{/if}
    <div class={styles.list}>
      {#each items as item (item.value ?? 'none')}<button
          class={styles.item}
          onclick={() => {
            onValueChange(item.value)
            open = false
          }}
          type="button"
          ><span class={styles.label}>{item.label}</span>{#if item === selected}<span class={styles.icon}><CheckIcon size="sm" /></span>{/if}</button
        >{/each}
    </div>
  </div></Popover
>

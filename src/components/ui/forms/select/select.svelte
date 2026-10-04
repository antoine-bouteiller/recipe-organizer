<script lang="ts" generics="TValue extends string">
  import { CheckIcon } from '@/components/ui/data-display/icons'
  import Popover from '@/components/ui/overlays/popover/popover.svelte'
  import { useIsMobile } from '@/hooks/use-is-mobile.svelte'

  import SelectButton from './select.shared.svelte'

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
      {id}><span id={valueId} class:empty={!selected}>{selected?.label ?? placeholder}</span></SelectButton
    >{/snippet}
  <div class="content">
    {#if mobile.current}<h2 class="title">{title ?? placeholder}</h2>{/if}
    <div class="list">
      {#each items as item (item.value ?? 'none')}<button
          class="item"
          onclick={() => {
            onValueChange(item.value)
            open = false
          }}
          type="button"
          ><span class="label">{item.label}</span>{#if item === selected}<span class="icon"><CheckIcon size="sm" /></span>{/if}</button
        >{/each}
    </div>
  </div></Popover
>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0px;
    min-width: calc(var(--anchor-width, 0px) - 16px - 2px);
  }

  .title {
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-semibold);
    line-height: var(--line-heights-none);
  }

  .list {
    display: flex;
    flex-direction: column;
    min-height: 0px;
    overflow-y: auto;
  }

  .item {
    align-items: center;
    border-radius: var(--radius-sm);
    display: flex;
    font-size: var(--font-sizes-base);
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

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    flex-shrink: 0;
  }

  .empty {
    color: var(--colors-muted-foreground);
  }
</style>

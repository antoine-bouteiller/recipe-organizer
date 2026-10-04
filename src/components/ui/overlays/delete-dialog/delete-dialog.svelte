<script module lang="ts">
  import type { Component, Snippet } from 'svelte'

  import type { IconProps } from '@/components/ui/data-display/icons/icon-types'
  import type { TriggerProps } from '@/hooks/use-drawer.svelte'

  export interface DeleteDialogProps {
    actionLabel?: string
    deleteButtonLabel?: string
    description: string
    icon?: Component<IconProps>
    onDelete: () => Promise<void> | void
    onOpenChange?: (open: boolean) => void
    open?: boolean
    title: string
    renderTrigger?: Snippet<[TriggerProps & { children: Snippet }]>
  }
</script>

<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import { TrashIcon } from '@/components/ui/data-display/icons/svelte'
  import Spinner from '@/components/ui/feedback/spinner/spinner.svelte'

  import Dialog from '../dialog/dialog.svelte'

  const {
    actionLabel = 'Supprimer',
    deleteButtonLabel,
    description,
    icon: TriggerIcon = TrashIcon,
    onDelete,
    onOpenChange,
    open,
    title,
    renderTrigger,
  }: DeleteDialogProps = $props()
  let internalOpen = $state(false)
  const isControlled = $derived(open !== undefined)
  const isOpen = $derived(open ?? internalOpen)
  let isLoading = $state(false)
  const setOpen = (next: boolean) => {
    if (!isControlled) {
      internalOpen = next
    }
    onOpenChange?.(next)
  }
  const handleDelete = async () => {
    if (isLoading) {
      return
    }
    isLoading = true
    try {
      await onDelete()
      setOpen(false)
    } finally {
      isLoading = false
    }
  }
</script>

{#snippet triggerChildren()}<TriggerIcon /> {deleteButtonLabel}{/snippet}
{#snippet trigger(props: TriggerProps)}
  {#if renderTrigger}{@render renderTrigger({ ...props, children: triggerChildren })}
  {:else}<Button {...props} size="icon" variant="destructive">{@render triggerChildren()}</Button>{/if}
{/snippet}

<Dialog
  cancelDisabled={isLoading}
  cancelLabel="Annuler"
  onOpenChange={setOpen}
  open={isOpen}
  {title}
  renderTrigger={isControlled ? undefined : trigger}
>
  {description}
  {#snippet footer()}<Button disabled={isLoading} onclick={handleDelete} variant="destructive"
      >{#if isLoading}<Spinner />{/if}
      {actionLabel}</Button
    >{/snippet}
</Dialog>

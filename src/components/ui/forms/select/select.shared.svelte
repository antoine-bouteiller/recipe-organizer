<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import { CaretUpDownIcon } from '@/components/ui/data-display/icons'
  import type { TriggerProps } from '@/hooks/use-drawer.svelte'

  import * as styles from './select.shared.css'

  type SelectButtonProps = TriggerProps &
    Pick<HTMLButtonAttributes, 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'disabled' | 'id' | 'aria-label'> & { children: Snippet }
  const { children, ...props }: SelectButtonProps = $props()
</script>

<button {...props} class={styles.selectTrigger} data-slot="select-button" type="button"
  ><span class={`${styles.selectText} ${styles.selectTextState.selected}`}>{@render children()}</span><span class={styles.selectTriggerIcon}
    ><CaretUpDownIcon /></span
  ></button
>

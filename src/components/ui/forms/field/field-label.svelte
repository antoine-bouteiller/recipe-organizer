<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  import { useField } from './field-context.svelte'

  import * as styles from './field.css'

  type FieldLabelProps = Pick<HTMLLabelAttributes, 'for' | 'id'> & {
    children: Snippet
    presentation?: 'dropzone-image' | 'dropzone-video'
  }
  const { children, for: htmlFor, id, presentation }: FieldLabelProps = $props()
  const field = useField()
</script>

<label class={styles.label({ presentation })} data-invalid={field.invalid || undefined} data-slot="field-label" for={htmlFor} {id}
  >{@render children()}</label
>

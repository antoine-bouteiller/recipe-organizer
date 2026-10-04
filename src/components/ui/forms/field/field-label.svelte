<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'

  import { useField } from './field-context.svelte'

  type FieldLabelProps = Pick<HTMLLabelAttributes, 'for' | 'id'> & {
    children: Snippet
    presentation?: 'dropzone-image' | 'dropzone-video'
  }
  const { children, for: htmlFor, id, presentation }: FieldLabelProps = $props()
  const field = useField()
</script>

<label class="label" data-presentation={presentation} data-invalid={field.invalid || undefined} data-slot="field-label" for={htmlFor} {id}
  >{@render children()}</label
>

<style>
  .label {
    align-items: center;
    color: var(--colors-foreground);
    display: inline-flex;
    font-size: var(--font-sizes-base);
    font-weight: var(--font-weights-medium);
    gap: 8px;
    line-height: 18px;
  }

  @media (min-width: 640px) {
    .label {
      font-size: var(--font-sizes-sm);
      line-height: 16px;
    }
  }

  .label[data-presentation='dropzone-image'] {
    background-color: var(--colors-background);
    border-color: var(--colors-input);
    border-radius: var(--radius-xl);
    border-style: dashed;
    border-width: 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 16px;
    position: relative;
    transition-duration: 150ms;
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
    min-height: 208px;
  }

  .label[data-presentation='dropzone-image']:has(:global(input:disabled)) {
    opacity: 0.5;
    pointer-events: none;
  }

  .label[data-presentation='dropzone-image']:has(:global(input:focus)) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }

  .label[data-presentation='dropzone-image']:hover {
    background-color: color-mix(in srgb, var(--colors-accent) 50%, transparent);
  }

  .label[data-presentation='dropzone-image'][data-invalid] {
    border-color: var(--colors-destructive);
  }

  .label[data-presentation='dropzone-image']:has(:global(img)) {
    border-style: none;
  }

  .label[data-presentation='dropzone-video'] {
    background-color: var(--colors-background);
    border-color: var(--colors-input);
    border-radius: var(--radius-xl);
    border-style: dashed;
    border-width: 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 16px;
    position: relative;
    transition-duration: 150ms;
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
    min-height: 128px;
  }

  .label[data-presentation='dropzone-video']:has(:global(input:disabled)) {
    opacity: 0.5;
    pointer-events: none;
  }

  .label[data-presentation='dropzone-video']:has(:global(input:focus)) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }

  .label[data-presentation='dropzone-video']:hover {
    background-color: color-mix(in srgb, var(--colors-accent) 50%, transparent);
  }

  .label[data-presentation='dropzone-video'][data-invalid] {
    border-color: var(--colors-destructive);
  }
</style>

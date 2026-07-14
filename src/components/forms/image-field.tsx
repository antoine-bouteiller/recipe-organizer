import { Show } from 'solid-js'
import Image from '~icons/ph/image'
import X from '~icons/ph/x'

import { Field, FieldControl, FieldError, FieldLabel } from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { type FileMetadata, useFileUpload } from '@/hooks/use-file-upload'
import { useFieldContext } from '@/hooks/use-form-context'
import { usePlatform } from '@/hooks/use-platfom'

interface ImageFieldProps {
  disabled?: boolean
  initialImage?: FileMetadata
  label: string
}

export const ImageField = (props: ImageFieldProps) => {
  const platform = usePlatform()
  const field = useFieldContext<File | FileMetadata>()

  const [fileState, { getInputProps, removeFile }] = useFileUpload({
    initialFiles: props.initialImage ? [props.initialImage] : [],
    maxFiles: 1,
    multiple: false,
    onFilesChange: (newFiles) => {
      field().setValue(newFiles[0]?.file)
    },
  })

  const previewUrl = () => fileState.files[0]?.preview

  return (
    <Field dirty={field().state.meta.isDirty} invalid={!field().state.meta.isValid} name={field().name} touched={field().state.meta.isTouched}>
      <FieldLabel>{props.label}</FieldLabel>
      <FieldLabel
        class="relative flex min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-invalid:border-destructive data-[dragging=true]:bg-accent/50"
        data-dragging={fileState.isDragging || undefined}
      >
        <Show
          when={previewUrl()}
          fallback={
            <div class="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div aria-hidden="true" class="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                <Image class="size-4 opacity-60" />
              </div>
              <p class="mb-1.5 text-sm font-medium">Déposez votre image ou cliquez pour parcourir</p>
              <KbdGroup class="hidden items-center gap-1 md:flex">
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd class="aspect-square">V</Kbd>
              </KbdGroup>
            </div>
          }
        >
          {(url) => (
            <div class="absolute inset-0">
              <img alt="Preview" class="size-full object-cover" src={url()} />
            </div>
          )}
        </Show>
        <Show when={previewUrl()}>
          <div class="absolute top-4 right-4">
            <button
              aria-label="Remove image"
              class="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                removeFile(fileState.files[0]?.id)
              }}
              type="button"
            >
              <X aria-hidden="true" class="size-4" />
            </button>
          </div>
        </Show>
      </FieldLabel>
      <FieldControl class="hidden" disabled={props.disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
}

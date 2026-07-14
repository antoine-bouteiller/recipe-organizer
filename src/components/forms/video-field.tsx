import { VideoCamera, X } from 'phosphor-solid'
import { Show } from 'solid-js'

import { Field, FieldControl, FieldError, FieldLabel } from '@/components/ui/field'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { type FileMetadata, useFileUpload } from '@/hooks/use-file-upload'
import { useFieldContext } from '@/hooks/use-form-context'
import { usePlatform } from '@/hooks/use-platfom'

interface VideoFieldProps {
  disabled?: boolean
  initialVideo?: FileMetadata
  label: string
}

const MAX_VIDEO_SIZE_MB = 100

export const VideoField = (props: VideoFieldProps) => {
  const platform = usePlatform()
  const field = useFieldContext<File | FileMetadata>()

  const [fileState, { getInputProps, removeFile }] = useFileUpload({
    accept: 'video/*',
    initialFiles: props.initialVideo ? [props.initialVideo] : [],
    maxFiles: 1,
    maxSize: MAX_VIDEO_SIZE_MB * 1024 * 1024,
    multiple: false,
    onFilesChange: (newFiles) => {
      field().setValue(newFiles[0]?.file)
    },
  })

  const videoFile = () => fileState.files[0]

  return (
    <Field dirty={field().state.meta.isDirty} invalid={!field().state.meta.isValid} name={field().name} touched={field().state.meta.isTouched}>
      <FieldLabel>{props.label}</FieldLabel>
      <FieldLabel
        class="relative flex min-h-32 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-invalid:border-destructive data-[dragging=true]:bg-accent/50"
        data-dragging={fileState.isDragging || undefined}
      >
        <Show
          when={videoFile()}
          fallback={
            <div class="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div aria-hidden="true" class="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                <VideoCamera class="size-4 opacity-60" />
              </div>
              <p class="mb-1.5 text-sm font-medium">Déposez votre vidéo ou cliquez pour parcourir</p>
              <p class="mb-2 text-xs text-muted-foreground">Formats supportés: MP4, WebM, MOV (max 100MB)</p>
              <KbdGroup class="hidden items-center gap-1 md:flex">
                <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd class="aspect-square">V</Kbd>
              </KbdGroup>
            </div>
          }
        >
          {(file) => (
            <div class="flex w-full items-center justify-between gap-4 px-4">
              <div class="flex items-center gap-3">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background">
                  <VideoCamera class="size-5 opacity-60" />
                </div>
                <div class="flex flex-col">
                  <p class="text-sm font-medium">{file().file.name || 'Video'}</p>
                  <Show when={file().file.size}>{(size) => <p class="text-xs text-muted-foreground">{formatBytes(size())}</p>}</Show>
                </div>
              </div>
              <button
                aria-label="Remove video"
                class="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors outline-none hover:bg-destructive/20 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  removeFile(file().id)
                }}
                type="button"
              >
                <X aria-hidden="true" class="size-4" />
              </button>
            </div>
          )}
        </Show>
      </FieldLabel>
      <FieldControl class="hidden" disabled={props.disabled} type="file" {...getInputProps()} />
      <FieldError />
    </Field>
  )
}

const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const base = 1024
  const dm = Math.max(0, decimals)
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const index = Math.floor(Math.log(bytes) / Math.log(base))

  return `${Number.parseFloat((bytes / base ** index).toFixed(dm))} ${sizes[index]}`
}

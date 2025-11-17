import { FieldControl, FieldLabel, FieldMessage, FormItem } from '@/components/forms/form'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { useFileUpload, type FileMetadata } from '@/hooks/use-file-upload'
import { useFieldContext } from '@/hooks/use-form-context'
import { usePlatform } from '@/hooks/use-platfom'
import { cn } from '@/lib/utils'
import { ImageIcon, XIcon } from '@phosphor-icons/react'

interface ImageFieldProps {
  label: string
  disabled?: boolean
  initialImage?: FileMetadata
}

export const ImageField = ({ label, disabled, initialImage }: ImageFieldProps) => {
  const platform = usePlatform()

  const { setValue } = useFieldContext<File | FileMetadata>()

  const [{ files, isDragging }, { removeFile, getInputProps }] = useFileUpload({
    maxFiles: 1,
    multiple: false,
    initialFiles: initialImage ? [initialImage] : [],
    onFilesChange: (files) => {
      setValue(files[0]?.file)
    },
  })

  const previewUrl = files[0]?.preview

  return (
    <FormItem>
      <FieldLabel className="text-base font-semibold">{label}</FieldLabel>
      <FieldLabel
        data-dragging={isDragging || undefined}
        className={cn(
          'border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]',
          'data-[error=true]:border-destructive data-[error=true]:ring-destructive/20 dark:data-[error=true]:ring-destructive/40 data-[error=true]:text-foreground'
        )}
      >
        {previewUrl ? (
          <div className="absolute inset-0">
            <img src={previewUrl} alt="Preview" className="size-full object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              Déposez votre image ou cliquez pour parcourir
            </p>
            <KbdGroup className="hidden md:flex items-center gap-1">
              <Kbd>{platform === 'macOS' ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd className="aspect-square">V</Kbd>
            </KbdGroup>
          </div>
        )}
        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                removeFile(files[0]?.id)
              }}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </FieldLabel>
      <FieldControl>
        <input type="file" className="hidden" disabled={disabled} {...getInputProps()} />
      </FieldControl>
      <FieldMessage />
    </FormItem>
  )
}

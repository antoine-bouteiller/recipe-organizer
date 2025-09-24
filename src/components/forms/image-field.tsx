import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form'
import { Kbd } from '@/components/ui/kbd'
import { useFileUpload, type FileMetadata } from '@/hooks/use-file-upload'
import { useFieldContext } from '@/hooks/use-form-context'
import { usePlatform } from '@/hooks/use-platfom'
import { cn } from '@/lib/utils'
import { CommandIcon, ImageUpIcon, XIcon } from 'lucide-react'

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
      <FormLabel className="text-base font-semibold">{label}</FormLabel>
      <FormLabel
        data-dragging={isDragging || undefined}
        className={cn(
          'border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]',
          'data-[error=true]:border-destructive data-[error=true]:ring-destructive/20 dark:data-[error=true]:ring-destructive/40 data-[error=true]:text-foreground'
        )}
      >
        {previewUrl ? (
          <div className="absolute inset-0">
            <img src={previewUrl} className="size-full object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageUpIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              Déposez votre image ou cliquez pour parcourir
            </p>
            {platform === 'macOS' && (
              <Kbd>
                <CommandIcon /> +V
              </Kbd>
            )}
            {platform === 'Windows' && <Kbd>Ctrl+V</Kbd>}
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
      </FormLabel>
      <FormControl>
        <input type="file" className="hidden" disabled={disabled} {...getInputProps()} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

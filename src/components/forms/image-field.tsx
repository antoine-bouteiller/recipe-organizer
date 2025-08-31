import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form'
import { Button } from '@/components/ui/button'
import { useFieldContext } from '@/hooks/use-form-context'
import { cn } from '@/lib/utils'
import { CommandIcon, UploadIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface ImageFieldProps {
  label: string
  disabled?: boolean
  initialPreview?: string
}

const isImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname.toLowerCase()
    return (
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname) ||
      parsedUrl.hostname.includes('imgur') ||
      parsedUrl.hostname.includes('unsplash') ||
      parsedUrl.hostname.includes('pexels')
    )
  } catch {
    return false
  }
}

export const ImageField = ({ label, disabled, initialPreview }: ImageFieldProps) => {
  const [preview, setPreview] = useState<string | undefined>(initialPreview)
  const [isMac, setIsMac] = useState(false)

  const { handleChange } = useFieldContext<File>()

  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes('mac'))
  }, [])

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleChange(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [handleChange]
  )

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      const { activeElement } = document
      const isTextInput =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.hasAttribute('contenteditable'))

      if (isTextInput) {
        return
      }

      const { clipboardData } = event
      if (!clipboardData) {
        return
      }

      const files = [...clipboardData.files]
      const imageFile = files.find((file) => file.type.startsWith('image/'))

      if (imageFile) {
        handleChange(imageFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(imageFile)
        return
      }

      const text = clipboardData.getData('text')
      if (text && isImageUrl(text)) {
        try {
          const response = await fetch(text)
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            const blob = await response.blob()
            const fileName = text.split('/').pop() || 'image.jpg'
            const file = new File([blob], fileName, { type: blob.type })
            handleChange(file)
            setPreview(URL.createObjectURL(file))
          }
        } catch {
          // do nothing
        }
      }
    },
    [handleChange]
  )

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  return (
    <FormItem>
      <FormLabel className="text-base font-semibold">{label}</FormLabel>
      <FormLabel
        className={cn(
          'flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          'data-[error=true]:border-destructive data-[error=true]:ring-destructive/20 dark:data-[error=true]:ring-destructive/40 data-[error=true]:text-foreground'
        )}
      >
        {preview ? (
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <img src={preview} alt="Aperçu" className="rounded-lg object-cover" />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black opacity-0 transition-opacity hover:opacity-50">
              <p className="font-medium">Cliquer pour changer</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="mb-3 h-8 w-8" />
            <p className="mb-2 text-sm">
              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs">PNG, JPG ou WEBP (MAX. 10MB)</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" size="icon" className="size-8">
                {isMac ? <CommandIcon className="size-3" /> : 'Ctrl'}
              </Button>
              <Button variant="outline" size="icon" className="size-8">
                V
              </Button>
            </div>
          </div>
        )}
      </FormLabel>
      <FormControl>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

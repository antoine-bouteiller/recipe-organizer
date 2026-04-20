import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type InputHTMLAttributes } from 'react'

import { isNotEmpty } from '@/utils/array'

export interface FileMetadata {
  id: string
  name?: string
  size?: number
  type?: string
  url: string
}

interface FileWithPreview {
  file: File | FileMetadata
  id: string
  preview?: string
}

interface FileUploadOptions {
  accept?: string
  initialFiles?: FileMetadata[]
  maxFiles?: number // Only used when multiple is true, defaults to Infinity
  maxSize?: number // In bytes
  multiple?: boolean // Defaults to false
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void // Callback when new files are added
  onFilesChange?: (files: FileWithPreview[]) => void // Callback when files change
}

interface FileUploadState {
  errors: string[]
  files: FileWithPreview[]
  isDragging: boolean
}

interface FileUploadActions {
  addFiles: (files: File[] | FileList) => void
  clearErrors: () => void
  clearFiles: () => void
  getInputProps: (props?: InputHTMLAttributes<HTMLInputElement>) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>
  }
  handleDragEnter: (event: DragEvent<HTMLElement>) => void
  handleDragLeave: (event: DragEvent<HTMLElement>) => void
  handleDragOver: (event: DragEvent<HTMLElement>) => void
  handleDrop: (event: DragEvent<HTMLElement>) => void
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  openFileDialog: () => void
  removeFile: (id: string) => void
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

const createPreview = (file: File | FileMetadata): string | undefined => {
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  return file.url
}

const generateUniqueId = (file: File | FileMetadata): string => {
  if (file instanceof File) {
    return `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }
  return file.id
}

const isEditableElementFocused = () => {
  const { activeElement } = document
  return activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.hasAttribute('contenteditable'))
}

const handleDragOver = (event: DragEvent<HTMLElement>) => {
  event.preventDefault()
  event.stopPropagation()
}

export const useFileUpload = (options: FileUploadOptions = {}): [FileUploadState, FileUploadActions] => {
  const { accept = '*', initialFiles = [], maxFiles = Infinity, maxSize = Infinity, multiple = false, onFilesAdded, onFilesChange } = options

  const [state, setState] = useState<FileUploadState>({
    errors: [],
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `Le fichier "${file.name}" dépasse la taille maximale de ${formatBytes(maxSize)}.`
    }

    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map((type) => type.trim())
      const fileType = file.type || ''
      const fileExtension = `.${file.name.split('.').pop()}`

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension.toLowerCase() === type.toLowerCase()
        }
        if (type.endsWith('/*')) {
          const [baseType] = type.split('/')
          return fileType.startsWith(`${baseType}/`)
        }
        return fileType === type
      })

      if (!isAccepted) {
        return `Le fichier "${file.name}" n'est pas un type de fichier accepté.`
      }
    }

    return null
  }

  const clearFiles = () => {
    const newFiles: FileWithPreview[] = []
    setState((prev) => {
      // Clean up object URLs
      for (const file of prev.files) {
        if (file.file.type?.startsWith('image/') && file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      }

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      const newState = {
        ...prev,
        errors: [],
        files: newFiles,
      }

      return newState
    })

    onFilesChange?.(newFiles)
  }

  const processFiles = (newFilesArray: File[]): { errors: string[]; validFiles: FileWithPreview[] } => {
    const errors: string[] = []
    const validFiles: FileWithPreview[] = []

    const filesToProcess = multiple
      ? newFilesArray.filter((file) => !state.files.some((existing) => existing.file.name === file.name && existing.file.size === file.size))
      : newFilesArray

    for (const file of filesToProcess) {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push({ file, id: generateUniqueId(file), preview: createPreview(file) })
      }
    }

    return { errors, validFiles }
  }

  const addFiles = (newFiles: File[] | FileList) => {
    if (!newFiles || newFiles.length === 0) {
      return
    }

    const newFilesArray = [...newFiles]

    setState((prev) => ({ ...prev, errors: [] }))

    if (!multiple) {
      clearFiles()
    }

    if (multiple && maxFiles !== Infinity && state.files.length + newFilesArray.length > maxFiles) {
      setState((prev) => ({ ...prev, errors: [`Vous ne pouvez uploader qu'un maximum de ${maxFiles} fichiers.`] }))
      return
    }

    const { errors, validFiles } = processFiles(newFilesArray)

    if (validFiles.length > 0) {
      onFilesAdded?.(validFiles)
      const updatedFiles = multiple ? [...state.files, ...validFiles] : validFiles
      setState((prev) => ({ ...prev, errors, files: updatedFiles }))
      onFilesChange?.(updatedFiles)
    } else if (errors.length > 0) {
      setState((prev) => ({ ...prev, errors }))
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const removeFile = (id: string) => {
    setState((prev) => {
      const fileToRemove = prev.files.find((file) => file.id === id)
      if (fileToRemove?.file?.type?.startsWith('image/') && fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }

      const newFiles = prev.files.filter((file) => file.id !== id)
      onFilesChange?.(newFiles)

      return {
        ...prev,
        errors: [],
        files: newFiles,
      }
    })
  }

  const clearErrors = () => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }))
  }

  const fetchImageFromUrl = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
        return
      }
      const blob = await response.blob()
      const fileName = url.split('/').pop() || 'image.jpg'
      addFiles([new File([blob], fileName, { type: blob.type })])
    } catch {
      // Do nothing
    }
  }

  const handlePaste = async (event: ClipboardEvent) => {
    if (isEditableElementFocused()) {
      return
    }

    const { clipboardData } = event
    if (!clipboardData) {
      return
    }

    const files = [...clipboardData.files]
    if (files.some((file) => file.type.startsWith('image/'))) {
      addFiles(files)
      return
    }

    const text = clipboardData.getData('text')
    if (text && isImageUrl(text)) {
      await fetchImageFromUrl(text)
    }
  }

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const handleDragEnter = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setState((prev) => ({ ...prev, isDragging: true }))
  }

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return
    }

    setState((prev) => ({ ...prev, isDragging: false }))
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setState((prev) => ({ ...prev, isDragging: false }))

    // Don't process files if the input is disabled
    if (inputRef.current?.disabled) {
      return
    }

    if (isNotEmpty(event.dataTransfer.files)) {
      // In single file mode, only use the first file
      if (multiple) {
        addFiles(event.dataTransfer.files)
      } else {
        const [file] = event.dataTransfer.files
        addFiles([file])
      }
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNotEmpty(event.target?.files)) {
      addFiles(event.target.files)
    }
  }

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const getInputProps = (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
    ...props,
    accept: props.accept || accept,
    multiple: props.multiple === undefined ? multiple : props.multiple,
    onChange: handleFileChange,
    ref: inputRef,
    type: 'file' as const,
  })

  return [
    state,
    {
      addFiles,
      clearErrors,
      clearFiles,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      removeFile,
    },
  ]
}

// Helper function to format bytes to human-readable format
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const base = 1024
  const dm = Math.max(0, decimals)
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const index = Math.floor(Math.log(bytes) / Math.log(base))

  return Number.parseFloat((bytes / base ** index).toFixed(dm)) + sizes[index]
}

import { type JSX, onCleanup, onMount } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

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
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void
  onFilesChange?: (files: FileWithPreview[]) => void
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
  getInputProps: (props?: JSX.InputHTMLAttributes<HTMLInputElement>) => JSX.InputHTMLAttributes<HTMLInputElement>
  handleDragEnter: (event: DragEvent) => void
  handleDragLeave: (event: DragEvent) => void
  handleDragOver: (event: DragEvent) => void
  handleDrop: (event: DragEvent) => void
  handleFileChange: (event: Event) => void
  openFileDialog: () => void
  removeFile: (id: string) => void
}

const isImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname.toLowerCase()
    return (
      /\.(?<ext>jpg|jpeg|png|gif|webp|svg)$/i.test(pathname) ||
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

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
}

export const useFileUpload = (options: FileUploadOptions = {}): [FileUploadState, FileUploadActions] => {
  const { accept = '*', initialFiles = [], maxFiles = Infinity, maxSize = Infinity, multiple = false, onFilesAdded, onFilesChange } = options

  const [state, setState] = createStore<FileUploadState>({
    errors: [],
    files: initialFiles.map((file) => ({ file, id: file.id, preview: file.url })),
    isDragging: false,
  })

  let inputRef: HTMLInputElement | undefined = undefined

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
    for (const file of state.files) {
      if (file.file.type?.startsWith('image/') && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    }

    if (inputRef) {
      inputRef.value = ''
    }

    setState(
      produce((draft) => {
        draft.errors = []
        draft.files = []
      })
    )

    onFilesChange?.([])
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

    setState('errors', [])

    if (!multiple) {
      clearFiles()
    }

    if (multiple && maxFiles !== Infinity && state.files.length + newFilesArray.length > maxFiles) {
      setState('errors', [`Vous ne pouvez uploader qu'un maximum de ${maxFiles} fichiers.`])
      return
    }

    const { errors, validFiles } = processFiles(newFilesArray)

    if (validFiles.length > 0) {
      onFilesAdded?.(validFiles)
      const updatedFiles = multiple ? [...state.files, ...validFiles] : validFiles
      setState(
        produce((draft) => {
          draft.errors = errors
          draft.files = updatedFiles
        })
      )
      onFilesChange?.(updatedFiles)
    } else if (errors.length > 0) {
      setState('errors', errors)
    }

    if (inputRef) {
      inputRef.value = ''
    }
  }

  const removeFile = (id: string) => {
    const fileToRemove = state.files.find((file) => file.id === id)
    if (fileToRemove?.file?.type?.startsWith('image/') && fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    const newFiles = state.files.filter((file) => file.id !== id)
    setState(
      produce((draft) => {
        draft.errors = []
        draft.files = newFiles
      })
    )
    onFilesChange?.(newFiles)
  }

  const clearErrors = () => {
    setState('errors', [])
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
      return
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

  onMount(() => {
    document.addEventListener('paste', handlePaste)
    onCleanup(() => document.removeEventListener('paste', handlePaste))
  })

  onCleanup(() => {
    for (const file of state.files) {
      if (file.file.type?.startsWith('image/') && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    }
  })

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setState('isDragging', true)
  }

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if ((event.currentTarget as Node | null)?.contains(event.relatedTarget as Node)) {
      return
    }

    setState('isDragging', false)
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setState('isDragging', false)

    if (inputRef?.disabled) {
      return
    }

    if (event.dataTransfer && isNotEmpty([...event.dataTransfer.files])) {
      if (multiple) {
        addFiles(event.dataTransfer.files)
      } else {
        const [file] = event.dataTransfer.files
        addFiles([file])
      }
    }
  }

  const handleFileChange = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement
    if (target.files && isNotEmpty([...target.files])) {
      addFiles(target.files)
    }
  }

  const openFileDialog = () => {
    inputRef?.click()
  }

  const getInputProps = (props: JSX.InputHTMLAttributes<HTMLInputElement> = {}) => ({
    ...props,
    accept: props.accept || accept,
    multiple: props.multiple === undefined ? multiple : props.multiple,
    onChange: handleFileChange,
    ref: (element: HTMLInputElement) => {
      inputRef = element
    },
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

'use client'

import type React from 'react'

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
  handleDragEnter: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
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

const handleDragOver = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
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

  const validateFile = (file: File): string | undefined => {
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

  const addFiles = (newFiles: File[] | FileList) => {
    if (!newFiles || newFiles.length === 0) {
      return
    }

    const newFilesArray = [...newFiles]
    const errors: string[] = []

    // Clear existing errors when new files are uploaded
    setState((prev) => ({ ...prev, errors: [] }))

    // In single file mode, clear existing files first
    if (!multiple) {
      clearFiles()
    }

    // Check if adding these files would exceed maxFiles (only in multiple mode)
    if (multiple && maxFiles !== Infinity && state.files.length + newFilesArray.length > maxFiles) {
      errors.push(`Vous ne pouvez uploader qu'un maximum de ${maxFiles} fichiers.`)
      setState((prev) => ({ ...prev, errors }))
      return
    }

    const validFiles: FileWithPreview[] = []

    for (const file of newFilesArray) {
      // Only check for duplicates if multiple files are allowed
      if (multiple) {
        const isDuplicate = state.files.some((existingFile) => existingFile.file.name === file.name && existingFile.file.size === file.size)

        // Skip duplicate files silently
        if (isDuplicate) {
          return
        }
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(
          multiple
            ? `Certains fichiers dépassent la taille maximale de ${formatBytes(maxSize)}.`
            : `Le fichier dépasse la taille maximale de ${formatBytes(maxSize)}.`
        )
        return
      }

      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push({
          file,
          id: generateUniqueId(file),
          preview: createPreview(file),
        })
      }
    }

    // Only update state if we have valid files to add
    if (validFiles.length > 0) {
      // Call the onFilesAdded callback with the newly added valid files
      onFilesAdded?.(validFiles)

      const updatedFiles = multiple ? [...state.files, ...validFiles] : validFiles

      setState((prev) => ({
        ...prev,
        errors,
        files: updatedFiles,
      }))

      onFilesChange?.(updatedFiles)
    } else if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        errors,
      }))
    }

    // Reset input value after handling files
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

  const handlePaste = async (event: ClipboardEvent) => {
    const { activeElement } = document
    const isTextInput = activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.hasAttribute('contenteditable'))

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
      addFiles(files)
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
          addFiles([file])
        }
      } catch {
        // Do nothing
      }
    }
  }

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, isDragging: true }))
  }

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }

    setState((prev) => ({ ...prev, isDragging: false }))
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, isDragging: false }))

    // Don't process files if the input is disabled
    if (inputRef.current?.disabled) {
      return
    }

    if (isNotEmpty(e.dataTransfer.files)) {
      // In single file mode, only use the first file
      if (multiple) {
        addFiles(e.dataTransfer.files)
      } else {
        const [file] = e.dataTransfer.files
        addFiles([file])
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNotEmpty(e.target?.files)) {
      addFiles(e.target.files)
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

  const k = 1024
  const dm = Math.max(0, decimals)
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / k ** i).toFixed(dm)) + sizes[i]
}

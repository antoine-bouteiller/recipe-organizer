import { onDestroy, onMount, untrack } from 'svelte'
import { createAttachmentKey } from 'svelte/attachments'
import type { Attachment } from 'svelte/attachments'
import type { HTMLInputAttributes } from 'svelte/elements'

export interface FileMetadata {
  id: string
  name?: string
  size?: number
  type?: string
  url: string
}
/** @lintignore Exported for story hosts. */
export interface FileWithPreview {
  file: File | FileMetadata
  id: string
  preview?: string
}
export interface FileUploadOptions {
  accept?: string
  disabled?: boolean
  initialFiles?: FileMetadata[]
  maxSize?: number
  onFilesChange?: (files: FileWithPreview[]) => void
}
export interface FileUploadState {
  readonly errors: string[]
  readonly files: FileWithPreview[]
}
export interface FileUploadActions {
  getInputProps: () => Pick<HTMLInputAttributes, 'accept' | 'onchange' | 'type'> & Record<symbol, Attachment<HTMLInputElement>>
  removeFile: (id: string | undefined) => void
}

const isImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return (
      /\.(?<ext>jpg|jpeg|png|gif|webp|svg)$/i.test(parsedUrl.pathname) ||
      parsedUrl.hostname.includes('imgur') ||
      parsedUrl.hostname.includes('unsplash') ||
      parsedUrl.hostname.includes('pexels')
    )
  } catch {
    return false
  }
}
const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const base = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const index = Math.floor(Math.log(bytes) / Math.log(base))
  return Number.parseFloat((bytes / base ** index).toFixed(2)) + sizes[index]
}

export const useFileUpload = (options: FileUploadOptions | (() => FileUploadOptions) = {}): [FileUploadState, FileUploadActions] => {
  const current = () => (typeof options === 'function' ? options() : options)
  let files = $state<FileWithPreview[]>(untrack(() => (current().initialFiles ?? []).map((file) => ({ file, id: file.id, preview: file.url }))))
  let errors = $state<string[]>([])
  let input: HTMLInputElement | undefined = undefined
  let destroyed = false
  let request: AbortController | undefined = undefined
  const ownedUrls = new Set<string>()
  const inputAttachment = createAttachmentKey()
  const cancelRequest = () => {
    request?.abort()
    request = undefined
  }
  const revoke = (preview: string | undefined) => {
    if (preview && ownedUrls.delete(preview)) {
      URL.revokeObjectURL(preview)
    }
  }
  const validateFile = (file: File): string | null => {
    const { accept = '*', maxSize = Infinity } = current()
    if (file.size > maxSize) {
      return `Le fichier "${file.name}" dépasse la taille maximale de ${formatBytes(maxSize)}.`
    }
    if (accept !== '*') {
      const fileExtension = `.${file.name.split('.').pop()}`
      const isAccepted = accept
        .split(',')
        .map((type) => type.trim())
        .some((type) => {
          if (type.startsWith('.')) {
            return fileExtension.toLowerCase() === type.toLowerCase()
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(`${type.split('/')[0]}/`)
          }
          return file.type === type
        })
      if (!isAccepted) {
        return `Le fichier "${file.name}" n'est pas un type de fichier accepté.`
      }
    }
    return null
  }
  const addFiles = (incoming: File[] | FileList) => {
    if (destroyed || current().disabled || incoming.length === 0) {
      return
    }
    cancelRequest()
    for (const file of files) {
      revoke(file.preview)
    }
    files = []
    errors = []
    current().onFilesChange?.([])
    const validFiles: FileWithPreview[] = []
    const nextErrors: string[] = []
    for (const file of incoming) {
      const error = validateFile(file)
      if (error) {
        nextErrors.push(error)
      } else {
        const preview = URL.createObjectURL(file)
        ownedUrls.add(preview)
        validFiles.push({ file, id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, preview })
      }
    }
    files = validFiles
    errors = nextErrors
    if (validFiles.length) {
      current().onFilesChange?.(validFiles)
    }
    if (input) {
      input.value = ''
    }
  }
  const removeFile = (id: string | undefined) => {
    if (destroyed || current().disabled) {
      return
    }
    cancelRequest()
    revoke(files.find((file) => file.id === id)?.preview)
    files = files.filter((file) => file.id !== id)
    errors = []
    if (input) {
      input.value = ''
    }
    current().onFilesChange?.(files)
  }
  const fetchImageFromUrl = async (text: string) => {
    cancelRequest()
    const pending = new AbortController()
    request = pending
    try {
      const response = await fetch(text, { signal: pending.signal })
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
        return
      }
      const blob = await response.blob()
      if (destroyed || request !== pending || pending.signal.aborted) {
        return
      }
      addFiles([new File([blob], text.split('/').pop() || 'image.jpg', { type: blob.type })])
    } catch {
      // A failed clipboard URL leaves the current selection unchanged.
    } finally {
      if (request === pending) {
        request = undefined
      }
    }
  }
  const handlePaste = (event: ClipboardEvent) => {
    if (destroyed || current().disabled) {
      return
    }
    const active = document.activeElement
    if (active?.tagName === 'TEXTAREA' || (active instanceof HTMLElement && active.isContentEditable)) {
      return
    }
    const clipboard = event.clipboardData
    if (!clipboard) {
      return
    }
    const pastedFiles = [...clipboard.files]
    if (pastedFiles.some((file) => file.type.startsWith('image/'))) {
      addFiles(pastedFiles)
      return
    }
    const text = clipboard.getData('text')
    if (text && isImageUrl(text)) {
      void fetchImageFromUrl(text)
    }
  }
  onMount(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  })
  onDestroy(() => {
    destroyed = true
    cancelRequest()
    for (const preview of ownedUrls) {
      URL.revokeObjectURL(preview)
    }
    ownedUrls.clear()
    input = undefined
  })
  return [
    {
      get errors() {
        return errors
      },
      get files() {
        return files
      },
    },
    {
      getInputProps: () => ({
        accept: current().accept ?? '*',
        onchange: (event) => {
          if (event.currentTarget.files) {
            addFiles(event.currentTarget.files)
          }
        },
        type: 'file',
        [inputAttachment]: (element: HTMLInputElement) => {
          input = element
          return () => {
            if (input === element) {
              input = undefined
            }
          }
        },
      }),
      removeFile,
    },
  ]
}

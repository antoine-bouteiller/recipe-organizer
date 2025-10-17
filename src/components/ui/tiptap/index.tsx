import { ListButton } from '@/components/ui/tiptap/list-button'
import { MarkButton } from '@/components/ui/tiptap/mark-button'
import { UndoRedoButton } from '@/components/ui/tiptap/undo-redo-button'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { TextStyleKit } from '@tiptap/extension-text-style'
import type { EditorContentProps } from '@tiptap/react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef } from 'react'

const extensions = [TextStyleKit, StarterKit]

const MenuBar = () => (
  <div className="flex gap-2">
    <ToggleGroup variant="outline">
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToggleGroup>
    <ToggleGroup variant="outline">
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="underline" />
      <ListButton type="bulletList" />
    </ToggleGroup>
  </div>
)

interface TiptapProps extends Omit<EditorContentProps, 'editor' | 'onChange'> {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const Tiptap = ({
  disabled,
  content,
  onChange,
  placeholder,
  className,
  ...props
}: TiptapProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: extensions,
    immediatelyRender: false,
    content,
    autofocus: false,
    editorProps: {
      handleScrollToSelection(this, view) {
        if ('focused' in view && !view.focused) {
          return true
        }

        return false
      },
      attributes: {
        class: cn(
          'min-h-40 w-full min-w-0 rounded-md border border-input bg-transparent p-3 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          'prose prose-sm max-w-none text-foreground focus:outline-none sm:prose-base',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) {
    return undefined
  }

  return (
    <div className="flex flex-col gap-2">
      <EditorContext.Provider value={{ editor }}>
        <MenuBar />
        <EditorContent
          editor={editor}
          disabled={disabled}
          ref={ref}
          placeholder={placeholder}
          {...props}
        />
      </EditorContext.Provider>
    </div>
  )
}

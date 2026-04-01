import {
  EditorContent,
  EditorContext,
  useEditor,
  useEditorState,
  type AnyExtension,
  type CanCommands,
  type ChainedCommands,
  type EditorContentProps,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useContext, useMemo } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { ToolbarButton } from '@/components/ui/toolbar'
import { cn } from '@/utils/cn'

type Command = 'bold' | 'bulletList' | 'italic' | 'orderedList' | 'redo' | 'taskList' | 'underline' | 'undo'

const canCommand = {
  bold: 'toggleBold',
  bulletList: 'toggleBulletList',
  italic: 'toggleItalic',
  orderedList: 'toggleOrderedList',
  redo: 'redo',
  taskList: 'toggleTaskList',
  underline: 'toggleUnderline',
  undo: 'undo',
} as const satisfies Record<Command, keyof CanCommands>

const runCommand = {
  bold: 'toggleBold',
  bulletList: 'toggleBulletList',
  italic: 'toggleItalic',
  orderedList: 'toggleOrderedList',
  redo: 'redo',
  taskList: 'toggleTaskList',
  underline: 'toggleUnderline',
  undo: 'undo',
} as const satisfies Record<Command, keyof ChainedCommands>

interface TiptapButtonProps {
  children: React.ReactNode
  command: Command
}

const TiptapButton = ({ children, command }: TiptapButtonProps) => {
  const { editor } = useContext(EditorContext)

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      canToggle: ctx.editor?.can()[canCommand[command]] ?? false,
      isActive: ctx.editor?.isActive(command) ?? false,
    }),
  })

  const toggle = () => {
    if (!editor?.isEditable) {
      return false
    }
    if (!editorState?.canToggle) {
      return false
    }

    editor.chain().focus()[runCommand[command]]().run()
  }

  return (
    <ToolbarButton
      aria-label={command}
      render={
        <Toggle
          aria-pressed={editorState?.isActive}
          data-pressed={editorState?.isActive === true ? true : undefined}
          disabled={!editorState?.canToggle}
          onClick={toggle}
          value={command}
        />
      }
    >
      {children}
    </ToolbarButton>
  )
}

interface TiptapProps {
  children?: React.ReactNode
  content?: string
  extensions?: AnyExtension[]
  onChange?: (content: string) => void
  readOnly?: boolean
}

const Tiptap = ({ children, content, extensions: extraExtensions, onChange, readOnly }: TiptapProps) => {
  const allExtensions = useMemo(() => (extraExtensions ? [StarterKit, ...extraExtensions] : [StarterKit]), [extraExtensions])

  const contextEditor = useEditor({
    autofocus: false,
    content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-sm max-w-none',
      },
      handleScrollToSelection(this, view) {
        if ('focused' in view && !view.focused) {
          return true
        }

        return false
      },
    },
    extensions: allExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return <EditorContext.Provider value={{ editor: contextEditor }}>{children}</EditorContext.Provider>
}

const TiptapContent = ({ className, ...props }: Omit<EditorContentProps, 'editor'>) => {
  const { editor } = useContext(EditorContext)

  return (
    <EditorContent
      className={cn(
        editor?.isEditable &&
          `w-full rounded-lg border border-input bg-background bg-clip-padding p-4 shadow-xs ring-ring/24 transition-shadow not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:border-ring has-focus-visible:ring-[3px] has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none dark:bg-input/32 dark:not-in-data-[slot=group]:bg-clip-border dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)] dark:has-aria-invalid:ring-destructive/24`,
        className
      )}
      editor={editor}
      {...props}
    />
  )
}

export { Tiptap, TiptapButton, TiptapContent }

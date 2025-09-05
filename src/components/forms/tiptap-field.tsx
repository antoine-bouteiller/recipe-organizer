import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useFieldContext } from '@/hooks/use-form-context'
import { cn } from '@/lib/utils'
import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { BoldIcon, ItalicIcon, ListIcon, Redo2Icon, Undo2Icon } from 'lucide-react'
import { useRef } from 'react'

const extensions = [TextStyleKit, StarterKit]

interface TiptapProps {
  label?: string
  disabled?: boolean
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold') ?? false,
      canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor.isActive('italic') ?? false,
      canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
      isBulletList: ctx.editor.isActive('bulletList') ?? false,
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,
    }),
  })

  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem
        value="bold"
        onClick={editor.chain().focus().toggleBold().run}
        disabled={!editorState.canBold}
        type="button"
      >
        <BoldIcon className="md:size-4 size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        onClick={editor.chain().focus().toggleItalic().run}
        disabled={!editorState.canItalic}
        type="button"
      >
        <ItalicIcon className="md:size-4 size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bulletList"
        onClick={editor.chain().focus().toggleBulletList().run}
        type="button"
      >
        <ListIcon className="md:size-4 size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="undo"
        onClick={editor.chain().focus().undo().run}
        disabled={!editorState.canUndo}
        type="button"
      >
        <Undo2Icon className="md:size-4 size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="redo"
        onClick={editor.chain().focus().redo().run}
        disabled={!editorState.canRedo}
        type="button"
      >
        <Redo2Icon className="md:size-4 size-3" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

const TiptapField = ({ label, disabled }: TiptapProps) => {
  const { state, handleChange } = useFieldContext<string>()

  const ref = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: extensions,
    content: state.value,
    immediatelyRender: false,
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
          'prose prose-sm max-w-none text-foreground focus:outline-none sm:prose-base'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML())
    },
  })

  if (!editor) {
    return undefined
  }

  return (
    <FormItem>
      <FormLabel className="text-base font-semibold">{label}</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-2">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} disabled={disabled} ref={ref} autoFocus={false} />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TiptapField

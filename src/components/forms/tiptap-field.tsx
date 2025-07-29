'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { type Editor, EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BoldIcon, ItalicIcon, ListIcon, Redo2Icon, Undo2Icon, WrapTextIcon } from 'lucide-react'
import { type Control, type FieldPath, type FieldValues, useController } from 'react-hook-form'

const extensions = [TextStyleKit, StarterKit]

interface TiptapProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  disabled?: boolean
}

function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button
        onClick={editor.chain().focus().toggleBold().run}
        disabled={!editorState.canBold}
        type="button"
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        onClick={editor.chain().focus().toggleItalic().run}
        disabled={!editorState.canItalic}
        type="button"
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <Button onClick={editor.chain().focus().setParagraph().run} type="button">
        <WrapTextIcon className="h-4 w-4" />
      </Button>
      <Button onClick={editor.chain().focus().toggleBulletList().run} type="button">
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button
        onClick={editor.chain().focus().undo().run}
        disabled={!editorState.canUndo}
        type="button"
      >
        <Undo2Icon className="h-4 w-4" />
      </Button>
      <Button
        onClick={editor.chain().focus().redo().run}
        disabled={!editorState.canRedo}
        type="button"
      >
        <Redo2Icon className="h-4 w-4" />
      </Button>
    </div>
  )
}

const TiptapField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  disabled,
}: TiptapProps<TFieldValues, TName>) => {
  const { field } = useController({ control, name })

  const editor = useEditor({
    extensions: extensions,
    content: field.value,
    immediatelyRender: false,
    editorProps: {
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
      field.onChange(editor.getHTML())
    },
  })

  return (
    <FormField
      control={control}
      name={name}
      render={() =>
        editor ? (
          <FormItem>
            <FormLabel className="text-base font-semibold">{label}</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} disabled={disabled} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        ) : (
          <div />
        )
      }
    />
  )
}

export default TiptapField

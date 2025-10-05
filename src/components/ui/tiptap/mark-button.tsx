import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { TextBIcon, TextItalicIcon, TextUnderlineIcon, type Icon } from '@phosphor-icons/react'
import { EditorContext, useEditorState } from '@tiptap/react'
import { useCallback, useContext } from 'react'

interface MarkButtonProps {
  type: Mark
}

export type Mark = 'bold' | 'italic' | 'underline'

const markIcons: Record<Mark, Icon> = {
  bold: TextBIcon,
  italic: TextItalicIcon,
  underline: TextUnderlineIcon,
}

export const MarkButton = ({ type }: MarkButtonProps) => {
  const { editor } = useContext(EditorContext)

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      canToggle: ctx.editor?.can().toggleMark(type) ?? false,
      isActive: ctx.editor?.isActive(type) ?? false,
    }),
  })

  const handleClick = useCallback(() => {
    if (!editor || !editorState?.canToggle) {
      return false
    }

    editor.chain().focus().toggleMark(type).run()
  }, [editor, type, editorState?.canToggle])

  const Icon = markIcons[type]

  return (
    <ToggleGroupItem
      value={type}
      onClick={handleClick}
      disabled={!editorState?.canToggle}
      data-state={editorState?.isActive ? 'on' : 'off'}
      type="button"
    >
      <Icon className="size-4" />
    </ToggleGroupItem>
  )
}

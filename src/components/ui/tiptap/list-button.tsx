import { ToggleGroupItem } from '@/components/ui/toggle-group'

import { EditorContext, useEditorState, type Editor } from '@tiptap/react'
import { ListIcon, ListOrderedIcon, ListTodoIcon, type LucideIcon } from 'lucide-react'
import { useCallback, useContext } from 'react'

export type ListType = 'bulletList' | 'orderedList' | 'taskList'

const listIcons: Record<ListType, LucideIcon> = {
  bulletList: ListIcon,
  orderedList: ListOrderedIcon,
  taskList: ListTodoIcon,
}

export const canToggleList = (editor: Editor | null, type: ListType): boolean => {
  if (!editor || !editor.isEditable) {
    return false
  }

  switch (type) {
    case 'bulletList': {
      return editor.can().toggleBulletList()
    }
    case 'orderedList': {
      return editor.can().toggleOrderedList()
    }
    case 'taskList': {
      return editor.can().toggleList('taskList', 'taskItem')
    }
    default: {
      return false
    }
  }
}

/**
 * Toggles list in the editor
 */
export const toggleList = (editor: Editor | null, type: ListType) => {
  if (!editor || !editor.isEditable) {
    return false
  }
  if (!canToggleList(editor, type)) {
    return false
  }

  let chain = editor.chain().focus()
  if (editor.isActive(type)) {
    // Unwrap list
    chain.lift(type).run()
  } else {
    switch (type) {
      case 'bulletList': {
        chain.toggleBulletList().run()
        break
      }
      case 'orderedList': {
        chain.toggleOrderedList().run()
        break
      }
      case 'taskList': {
        chain.toggleList('taskList', 'taskItem').run()
        break
      }
      default: {
        return
      }
    }
  }

  editor.chain().focus().selectTextblockEnd().run()
}

interface ListButtonProps {
  type: ListType
}

export const ListButton = ({ type }: ListButtonProps) => {
  const { editor } = useContext(EditorContext)

  const canToggle = canToggleList(editor, type)

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      canToggle: canToggleList(ctx.editor, type) ?? false,
      isActive: ctx.editor?.isActive(type) ?? false,
    }),
  })

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.defaultPrevented) {
        return
      }
      toggleList(editor, type)
    },
    [type, editor]
  )

  const Icon = listIcons[type]

  return (
    <ToggleGroupItem
      value={type}
      onClick={handleClick}
      disabled={!canToggle}
      data-state={editorState?.isActive ? 'on' : 'off'}
      type="button"
    >
      <Icon className="size-4" />
    </ToggleGroupItem>
  )
}

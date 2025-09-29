import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { EditorContext } from '@tiptap/react'
import { Redo2Icon, Undo2Icon, type LucideIcon } from 'lucide-react'
import { useCallback, useContext } from 'react'

type UndoRedoAction = 'undo' | 'redo'

const undoRedoIcons: Record<UndoRedoAction, LucideIcon> = {
  undo: Undo2Icon,
  redo: Redo2Icon,
}

interface UndoRedoButtonProps {
  action: UndoRedoAction
}

export const UndoRedoButton = ({ action }: UndoRedoButtonProps) => {
  const { editor } = useContext(EditorContext)
  const canExecute = action === 'undo' ? editor?.can().undo() : editor?.can().redo()

  const handleAction = useCallback(() => {
    if (!editor) {
      return false
    }

    const chain = editor.chain().focus()
    return action === 'undo' ? chain.undo().run() : chain.redo().run()
  }, [editor, action])

  const Icon = undoRedoIcons[action]

  return (
    <ToggleGroupItem value={action} onClick={handleAction} disabled={!canExecute} data-state="off">
      <Icon className="size-4" />
    </ToggleGroupItem>
  )
}

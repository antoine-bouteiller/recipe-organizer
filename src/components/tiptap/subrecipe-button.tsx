import { BookOpenIcon } from '@phosphor-icons/react'
import { EditorContext } from '@tiptap/react'
import { useContext } from 'react'

import type { SubrecipeNodeData } from '@/components/tiptap/types/subrecipe'

import { Toggle } from '../ui/toggle'
import { SubrecipeDialog } from './subrecipe-dialog'

export const SubrecipeButton = () => {
  const { editor } = useContext(EditorContext)

  const handleInsert = (data: SubrecipeNodeData) => {
    if (!editor) {
      return
    }

    editor.chain().focus().setSubrecipe(data).run()
  }

  return (
    <SubrecipeDialog
      onSubmit={handleInsert}
      submitLabel="Insérer"
      title="Ajouter une sous-recette"
      triggerRender={<Toggle data-pressed={undefined} />}
    >
      <BookOpenIcon className="size-4" />
    </SubrecipeDialog>
  )
}

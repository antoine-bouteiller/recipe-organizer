import { BookOpenIcon } from '@phosphor-icons/react'
import { EditorContext } from '@tiptap/react'
import { useContext } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { type SubrecipeNodeData } from '@/features/recipe/types/subrecipe'

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

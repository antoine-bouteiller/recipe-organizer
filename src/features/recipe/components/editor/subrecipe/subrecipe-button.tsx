import { $insertNodeToNearestRoot } from '@lexical/utils'
import BookOpen from '~icons/ph/book-open'

import { useEditor } from '@/components/common/editor'
import { Toggle } from '@/components/ui/toggle'
import { type SubrecipeNodeData } from '@/features/recipe/types/subrecipe'

import { SubrecipeDialog } from './subrecipe-dialog'
import { $createSubrecipeNode } from './subrecipe-node'

export const SubrecipeButton = () => {
  const editor = useEditor()

  const handleInsert = (data: SubrecipeNodeData) => {
    editor.update(() => {
      const node = $createSubrecipeNode(data)
      $insertNodeToNearestRoot(node)
    })
    editor.focus()
  }

  return (
    <SubrecipeDialog
      onSubmit={handleInsert}
      submitLabel="Insérer"
      title="Ajouter une sous-recette"
      trigger={(Trigger) => (
        <Trigger as={Toggle}>
          <BookOpen class="size-4" />
        </Trigger>
      )}
    />
  )
}

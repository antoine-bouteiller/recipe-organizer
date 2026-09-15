import { type SubrecipeNodeData } from '@client/features/recipe/types/subrecipe'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { BookOpenIcon } from '@recipe-organizer/design-system/icons/book-open'
import { Toggle } from '@recipe-organizer/design-system/toggle'

import { SubrecipeDialog } from './subrecipe-dialog'
import { $createSubrecipeNode } from './subrecipe-node'

export const SubrecipeButton = () => {
  const [editor] = useLexicalComposerContext()

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
      triggerRender={
        <Toggle data-pressed={undefined}>
          {' '}
          <BookOpenIcon className="size-4" />
        </Toggle>
      }
    />
  )
}

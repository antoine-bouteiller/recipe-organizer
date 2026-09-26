import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { CookingPotIcon } from '@recipe-organizer/design-system/icons/cooking-pot'
import { Toggle } from '@recipe-organizer/design-system/toggle'
import { type MagimixProgramData } from '@recipe-organizer/shared/recipe/magimix'

import { MagimixProgramDialog } from './magimix-program-dialog'
import { $createMagimixProgramNode } from './magimix-program-node'

export const MagimixProgramButton = () => {
  const [editor] = useLexicalComposerContext()

  const handleInsert = (data: MagimixProgramData) => {
    editor.update(() => {
      const node = $createMagimixProgramNode(data)
      $insertNodeToNearestRoot(node)
    })
    editor.focus()
  }

  return (
    <MagimixProgramDialog
      onSubmit={handleInsert}
      submitLabel="Insérer"
      title="Ajouter un programme Magimix"
      triggerRender={
        <Toggle pressed={false}>
          <CookingPotIcon size="sm" />
        </Toggle>
      }
    />
  )
}

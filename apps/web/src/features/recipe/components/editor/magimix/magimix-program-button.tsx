import { CookingPotIcon } from '@client/components/icons'
import { Toggle } from '@client/components/ui/toggle'
import { type MagimixProgramData } from '@client/features/recipe/types/magimix'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'

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
        <Toggle data-pressed={undefined}>
          <CookingPotIcon className="size-4" />
        </Toggle>
      }
    />
  )
}

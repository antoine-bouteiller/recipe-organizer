import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { CookingPotIcon } from '@phosphor-icons/react'

import { Toggle } from '@/components/ui/toggle'
import { type MagimixProgramData } from '@/features/recipe/types/magimix'

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

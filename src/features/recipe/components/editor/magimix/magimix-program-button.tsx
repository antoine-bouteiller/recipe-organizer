import { $insertNodeToNearestRoot } from '@lexical/utils'
import CookingPot from '~icons/ph/cooking-pot'

import { useEditor } from '@/components/common/editor'
import { Toggle } from '@/components/ui/toggle'
import { type MagimixProgramData } from '@/features/recipe/types/magimix'

import { MagimixProgramDialog } from './magimix-program-dialog'
import { $createMagimixProgramNode } from './magimix-program-node'

export const MagimixProgramButton = () => {
  const editor = useEditor()

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
      trigger={(Trigger) => (
        <Trigger as={Toggle}>
          <CookingPot class="size-4" />
        </Trigger>
      )}
    />
  )
}

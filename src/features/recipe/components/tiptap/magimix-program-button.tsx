import { CookingPotIcon } from '@phosphor-icons/react'
import { EditorContext } from '@tiptap/react'
import { useContext } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { type MagimixProgramData } from '@/features/recipe/types/magimix'

import { MagimixProgramDialog } from './magimix-program-dialog'

export const MagimixProgramButton = () => {
  const { editor } = useContext(EditorContext)

  const handleInsert = (data: MagimixProgramData) => {
    if (!editor) {
      return
    }

    editor.chain().focus().setMagimixProgram(data).run()
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

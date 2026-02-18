import { CookingPotIcon } from '@phosphor-icons/react'
import { EditorContext } from '@tiptap/react'
import { useContext } from 'react'

import type { MagimixProgramData } from '@/components/tiptap/types/magimix'

import { Toggle } from '../ui/toggle'
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

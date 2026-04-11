import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export const OnChangePlugin = ({ onChange }: { onChange?: (content: string) => void }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!onChange) {
      return
    }

    return editor.registerUpdateListener(({ editorState }) => {
      onChange(JSON.stringify(editorState.toJSON()))
    })
  }, [editor, onChange])

  return null
}

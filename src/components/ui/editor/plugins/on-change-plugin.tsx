import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

export const OnChangePlugin = ({ onChange }: { onChange?: (content: string) => void }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!onChange) {
      return
    }

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor)
        onChange(html)
      })
    })
  }, [editor, onChange])

  return null
}

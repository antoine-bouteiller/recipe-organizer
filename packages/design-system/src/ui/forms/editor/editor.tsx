import { HistoryExtension } from '@lexical/history'
import { $isListNode, CheckListExtension, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer'
import { useExtensionSignalValue } from '@lexical/react/useExtensionSignalValue'
import { RichTextExtension } from '@lexical/rich-text'
import { $getNearestNodeOfType } from '@lexical/utils'
import { ToolbarToggle } from '@recipe-organizer/design-system/toolbar'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  configExtension,
  defineExtension,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type Klass,
  type LexicalNode,
  type TextFormatType,
} from 'lexical'
import { useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'

import { OnChangePlugin } from './plugins/on-change-plugin'

import * as styles from './editor.css'

type EditorCommand = 'bold' | 'bulletList' | 'italic' | 'redo' | 'underline' | 'undo'
type EditorContentWidth = 'full' | 'reading'

interface EditorToolbarButtonProps {
  children: ReactNode
  command: EditorCommand
}

const EditorToolbarButton = ({ children, command }: EditorToolbarButtonProps) => {
  const [editor] = useLexicalComposerContext()
  const [isActive, setIsActive] = useState(false)
  const canUndo = useExtensionSignalValue(HistoryExtension, 'canUndo')
  const canRedo = useExtensionSignalValue(HistoryExtension, 'canRedo')
  const canExecute = (command !== 'undo' || canUndo) && (command !== 'redo' || canRedo)

  useEffect(() => {
    const formatCommands: TextFormatType[] = ['bold', 'italic', 'underline']
    const updateActiveState = () => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return
      }
      const format = formatCommands.find((formatCommand) => formatCommand === command)
      if (format) {
        setIsActive(selection.hasFormat(format))
      } else if (command === 'bulletList') {
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
        const parentList = $getNearestNodeOfType(element, ListNode)
        setIsActive($isListNode(parentList) && parentList.getListType() === 'bullet')
      } else {
        setIsActive(false)
      }
    }
    const unregisterSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateActiveState()
        return false
      },
      COMMAND_PRIORITY_LOW
    )
    const unregisterUpdate = editor.registerUpdateListener(({ editorState }) => editorState.read(updateActiveState))
    return () => {
      unregisterSelection()
      unregisterUpdate()
    }
  }, [editor, command])

  const toggle = useCallback(() => {
    if (!editor.isEditable()) {
      return
    }
    switch (command) {
      case 'bold':
      case 'italic':
      case 'underline': {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, command)
        break
      }
      case 'bulletList': {
        editor.dispatchCommand(isActive ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      }
      case 'undo': {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
        break
      }
      case 'redo': {
        editor.dispatchCommand(REDO_COMMAND, undefined)
        break
      }
      default: {
        break
      }
    }
  }, [editor, command, isActive])

  return (
    <ToolbarToggle aria-label={command} disabled={!canExecute} onClick={toggle} pressed={isActive} value={command}>
      {children}
    </ToolbarToggle>
  )
}

interface EditorProps {
  children?: ReactNode
  content?: string
  nodes?: readonly Klass<LexicalNode>[]
  onChange?: (content: string) => void
  readOnly?: boolean
}

const Editor = ({ children, content, nodes: extraNodes, onChange, readOnly }: EditorProps) => {
  const [extension, ,] = useState(() =>
    defineExtension({
      $initialEditorState: content,
      dependencies: [RichTextExtension, CheckListExtension, configExtension(HistoryExtension, { delay: 1000 })],
      editable: !readOnly,
      name: 'RecipeEditor',
      namespace: 'RecipeEditor',
      nodes: [...(extraNodes ?? [])],
      onError: (error: Error) => {
        throw error
      },
      theme: {
        list: { checklist: styles.editorChecklist, listitemChecked: styles.editorCheckedListItem },
        text: { underline: styles.editorUnderline },
      },
    })
  )
  return (
    <LexicalExtensionComposer extension={extension} contentEditable={null}>
      {onChange && <OnChangePlugin onChange={onChange} />}
      {children}
    </LexicalExtensionComposer>
  )
}

interface EditorContentProps {
  disabled?: boolean
  width?: EditorContentWidth
}

const EditorContent = ({ disabled, width = 'full' }: EditorContentProps) => {
  const [editor] = useLexicalComposerContext()
  const [initiallyEditable, ,] = useState(() => editor.isEditable())
  useLayoutEffect(() => {
    editor.setEditable(!disabled && initiallyEditable)
  }, [disabled, editor, initiallyEditable])
  const contentStyle = initiallyEditable ? styles.editorContentEditable : styles.editorContent
  return (
    <ContentEditable
      aria-disabled={disabled || undefined}
      aria-readonly={disabled || !editor.isEditable() || undefined}
      className={contentStyle[width]}
      data-editor-content=""
    />
  )
}

export { Editor, EditorContent, EditorToolbarButton }

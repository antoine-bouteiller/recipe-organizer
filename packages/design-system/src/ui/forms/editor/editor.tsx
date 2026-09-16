import { HistoryExtension } from '@lexical/history'
import { $isListNode, CheckListExtension, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer'
import { useExtensionSignalValue } from '@lexical/react/useExtensionSignalValue'
import { RichTextExtension } from '@lexical/rich-text'
import { $getNearestNodeOfType } from '@lexical/utils'
import { css } from '@recipe-organizer/design-system/css'
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

import { ToolbarToggle } from '../../actions/toolbar/toolbar'
import { OnChangePlugin } from './plugins/on-change-plugin'

type EditorCommand = 'bold' | 'bulletList' | 'italic' | 'redo' | 'underline' | 'undo'
type EditorContentWidth = 'full' | 'reading'

const editorUnderline = css({ textDecoration: 'underline' })
const editorContentBase = css({
  '& > :not([data-editor-decorator]) :where(a)': { color: 'oklch(0.446 0.043 257.281)', textDecoration: 'underline' },
  '& > :not([data-editor-decorator]) :where(b, strong)': { fontWeight: '700' },
  '& > :not([data-editor-decorator]) :where(em, i)': { fontStyle: 'italic' },
  '& > :not([data-editor-decorator]) :where(li)': { marginBottom: '4px', marginTop: '4px', paddingInlineStart: '6px' },
  '& > :where(h1)': { fontSize: '30px', lineHeight: '36px', marginBottom: '24px', marginTop: '0px' },
  '& > :where(h1, h2, h3, h4)': { color: 'oklch(0.21 0.034 264.665)', fontWeight: '700' },
  '& > :where(h2)': { fontSize: '20px', lineHeight: '28px', marginBottom: '16px', marginTop: '32px' },
  '& > :where(h3)': { fontSize: '18px', lineHeight: '28px', marginBottom: '8px', marginTop: '24px' },
  '& > :where(h4)': { fontSize: '16px', lineHeight: '24px', marginBottom: '8px', marginTop: '20px' },
  '& > :where(ol, ul)': { marginBottom: '12px', marginTop: '12px', paddingInlineStart: '22px' },
  '& > :where(p)': { marginBottom: '0px', marginTop: '0px' },
  _dark: {
    '& > :not([data-editor-decorator]) :where(a)': { color: 'oklch(0.707 0.022 261.325)' },
    '& > :where(h1, h2, h3, h4)': { color: 'white' },
    color: 'oklch(0.872 0.01 258.338)',
  },
  color: 'oklch(0.373 0.034 259.733)',
  fontFamily: 'sans',
  fontSize: 'sm',
  lineHeight: '1.5rem',
  outline: 'none',
})
const editorChecklist = css({ listStyleType: 'none', paddingInlineStart: '0' })
const editorCheckedListItem = css({ textDecoration: 'line-through' })
const editorContentFull = css({ width: 'full' })
const editorContentReading = css({ maxWidth: '65ch', width: 'full' })
const editorContentEditable = css({
  '&[aria-disabled=true]': { opacity: '64%' },
  _dark: { backgroundColor: 'color-mix(in oklab, token(colors.input) 32%, transparent)' },
  _focusVisible: { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 24%, transparent)' },
  _invalid: { borderColor: 'color-mix(in oklab, token(colors.destructive) 36%, transparent)' },
  backgroundClip: 'padding-box',
  backgroundColor: 'background',
  borderColor: 'input',
  borderRadius: 'lg',
  borderWidth: '1px',
  padding: '4',
  shadow: 'xs',
  transition: 'box-shadow 150ms',
})

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
      theme: { list: { checklist: editorChecklist, listitemChecked: editorCheckedListItem }, text: { underline: editorUnderline } },
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
  const widthClassName = width === 'reading' ? editorContentReading : editorContentFull
  const editableClassName = initiallyEditable ? ` ${editorContentEditable}` : ''
  return (
    <ContentEditable
      aria-disabled={disabled || undefined}
      aria-readonly={disabled || !editor.isEditable() || undefined}
      className={`${editorContentBase} ${widthClassName}${editableClassName}`}
      data-editor-content=""
    />
  )
}

export { Editor, EditorContent, EditorToolbarButton }

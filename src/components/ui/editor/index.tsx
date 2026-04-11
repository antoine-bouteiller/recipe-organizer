import '@tanstack/react-start/client-only'
import { $generateNodesFromDOM } from '@lexical/html'
import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode, REMOVE_LIST_COMMAND } from '@lexical/list'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $getNearestNodeOfType } from '@lexical/utils'
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type Klass,
  type LexicalNode,
  type TextFormatType,
} from 'lexical'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { ToolbarButton } from '@/components/ui/toolbar'
import { cn } from '@/utils/cn'

import { OnChangePlugin } from './plugins/on-change-plugin'

type Command = 'bold' | 'bulletList' | 'italic' | 'redo' | 'underline' | 'undo'

const LexicalErrorBoundary = ({ children }: { children: ReactNode }) => <>{children}</>

const EditorToolbarButton = ({ children, command }: { children: ReactNode; command: Command }) => {
  const [editor] = useLexicalComposerContext()
  const [isActive, setIsActive] = useState(false)
  const [canExecute, setCanExecute] = useState(false)

  useEffect(() => {
    const formatCommands = new Set<TextFormatType>(['bold', 'italic', 'underline'])

    const updateActiveState = () => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return
      }
      if (formatCommands.has(command as TextFormatType)) {
        setIsActive(selection.hasFormat(command as TextFormatType))
      } else if (command === 'bulletList') {
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
        const parentList = $getNearestNodeOfType(element, ListNode)
        setIsActive($isListNode(parentList) && parentList.getListType() === 'bullet')
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

    const unregisterUpdate = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateActiveState()
      })
    })

    const cleanups = [unregisterSelection, unregisterUpdate]

    if (command === 'undo') {
      setCanExecute(false)
      cleanups.push(
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanExecute(payload)
            return false
          },
          COMMAND_PRIORITY_LOW
        )
      )
    } else if (command === 'redo') {
      setCanExecute(false)
      cleanups.push(
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanExecute(payload)
            return false
          },
          COMMAND_PRIORITY_LOW
        )
      )
    } else {
      setCanExecute(true)
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup()
      }
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
        if (isActive) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
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
    <ToolbarButton
      aria-label={command}
      render={<Toggle aria-pressed={isActive} data-pressed={isActive ? true : undefined} disabled={!canExecute} onClick={toggle} value={command} />}
    >
      {children}
    </ToolbarButton>
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
  const allNodes = useMemo(() => [HeadingNode, QuoteNode, ListNode, ListItemNode, ...(extraNodes ?? [])], [extraNodes])

  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      editable: !readOnly,
      editorState: content
        ? (editor) => {
            const parser = new DOMParser()
            const dom = parser.parseFromString(content, 'text/html')
            const nodes = $generateNodesFromDOM(editor, dom)
            const root = $getRoot()
            root.clear()
            root.append(...nodes)
          }
        : undefined,
      namespace: 'RecipeEditor',
      nodes: allNodes,
      onError: (error: Error) => {
        throw error
      },
      theme: {
        paragraph: '',
        text: {
          bold: 'font-bold',
          italic: 'italic',
          underline: 'underline',
        },
      },
    }),
    [readOnly, allNodes, content]
  )

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ListPlugin />
      <CheckListPlugin />
      <HistoryPlugin />
      <OnChangePlugin onChange={onChange} />
      {children}
    </LexicalComposer>
  )
}

interface EditorContentProps {
  className?: string
  disabled?: boolean
}

const EditorContent = ({ className, disabled }: EditorContentProps) => {
  const [editor] = useLexicalComposerContext()
  const isEditable = editor.isEditable()

  return (
    <RichTextPlugin
      contentEditable={
        <ContentEditable
          aria-disabled={disabled}
          className={cn(
            'focus:outline-none prose prose-sm max-w-none',
            isEditable &&
              'w-full rounded-lg border border-input bg-background bg-clip-padding p-4 shadow-xs ring-ring/24 transition-shadow not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:border-ring has-focus-visible:ring-[3px] has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none dark:bg-input/32 dark:not-in-data-[slot=group]:bg-clip-border dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)] dark:has-aria-invalid:ring-destructive/24',
            className
          )}
        />
      }
      ErrorBoundary={LexicalErrorBoundary}
      placeholder={null}
    />
  )
}

export { Editor, EditorContent, EditorToolbarButton }

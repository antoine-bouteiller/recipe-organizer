import { createEmptyHistoryState, registerHistory } from '@lexical/history'
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
  registerCheckList,
  registerList,
} from '@lexical/list'
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  createEditor,
  FORMAT_TEXT_COMMAND,
  type Klass,
  type LexicalEditor,
  type LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
  UNDO_COMMAND,
} from 'lexical'
import { createContext, createSignal, For, type JSX, onCleanup, onMount, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'

import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/utils/cn'

const EditorContext = createContext<LexicalEditor>()
export const useEditor = (): LexicalEditor => {
  const editor = useContext(EditorContext)
  if (!editor) {
    throw new Error('useEditor must be used within an <Editor>')
  }
  return editor
}

type Command = 'bold' | 'bulletList' | 'italic' | 'redo' | 'underline' | 'undo'

const formatCommands = new Set<TextFormatType>(['bold', 'italic', 'underline'])

const EditorToolbarButton = (props: { children: JSX.Element; command: Command }) => {
  const editor = useEditor()
  const [isActive, setIsActive] = createSignal(false)
  const [canExecute, setCanExecute] = createSignal(props.command !== 'undo' && props.command !== 'redo')

  const updateActiveState = () => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }
    if (formatCommands.has(props.command as TextFormatType)) {
      setIsActive(selection.hasFormat(props.command as TextFormatType))
    } else if (props.command === 'bulletList') {
      const anchorNode = selection.anchor.getNode()
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
      const parentList = $getNearestNodeOfType(element, ListNode)
      setIsActive($isListNode(parentList) && parentList.getListType() === 'bullet')
    }
  }

  const cleanups = [
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateActiveState()
        return false
      },
      COMMAND_PRIORITY_LOW
    ),
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(updateActiveState)
    }),
  ]

  if (props.command === 'undo') {
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
  } else if (props.command === 'redo') {
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
  }

  onCleanup(() => {
    for (const cleanup of cleanups) {
      cleanup()
    }
  })

  const toggle = () => {
    if (!editor.isEditable()) {
      return
    }
    switch (props.command) {
      case 'bold':
      case 'italic':
      case 'underline': {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, props.command)
        break
      }
      case 'bulletList': {
        editor.dispatchCommand(isActive() ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND, undefined)
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
  }

  return (
    <Toggle aria-label={props.command} disabled={!canExecute()} onClick={toggle} pressed={isActive()}>
      {props.children}
    </Toggle>
  )
}

interface EditorProps {
  children?: JSX.Element
  content?: string
  nodes?: readonly Klass<LexicalNode>[]
  onChange?: (content: string) => void
  readOnly?: boolean
}

const Editor = (props: EditorProps) => {
  const editor = createEditor({
    editable: !props.readOnly,
    namespace: 'RecipeEditor',
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, ...(props.nodes ?? [])],
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
  })

  if (props.content) {
    editor.setEditorState(editor.parseEditorState(props.content))
  }

  const [decorators, setDecorators] = createSignal<Record<string, JSX.Element>>({})

  const registrations = [
    registerRichText(editor),
    registerList(editor),
    registerCheckList(editor),
    registerHistory(editor, createEmptyHistoryState(), 300),
    editor.registerDecoratorListener<JSX.Element>((next) => setDecorators({ ...next })),
  ]
  if (props.onChange) {
    registrations.push(editor.registerUpdateListener(({ editorState }) => props.onChange?.(JSON.stringify(editorState.toJSON()))))
  }
  onCleanup(mergeRegister(...registrations))

  return (
    <EditorContext.Provider value={editor}>
      {props.children}
      <For each={Object.keys(decorators())}>
        {(key) => {
          const element = editor.getElementByKey(key)
          return element ? <Portal mount={element}>{decorators()[key]}</Portal> : null
        }}
      </For>
    </EditorContext.Provider>
  )
}

const EditorContent = (props: { class?: string; disabled?: boolean }) => {
  const editor = useEditor()
  const isEditable = editor.isEditable()
  let ref: HTMLDivElement | undefined = undefined

  onMount(() => {
    editor.setRootElement(ref ?? null)
    onCleanup(() => editor.setRootElement(null))
  })

  return (
    <div
      aria-disabled={props.disabled}
      class={cn(
        'prose prose-sm max-w-none focus:outline-none dark:prose-invert',
        isEditable &&
          'w-full rounded-lg border border-input bg-background bg-clip-padding p-4 shadow-xs ring-ring/24 transition-shadow not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:border-ring has-focus-visible:ring-[3px] has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none dark:bg-input/32 dark:not-in-data-[slot=group]:bg-clip-border dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)] dark:has-aria-invalid:ring-destructive/24',
        props.class
      )}
      contentEditable={isEditable}
      data-slot="editor-content"
      ref={(el) => (ref = el)}
    />
  )
}

export { Editor, EditorContent, EditorToolbarButton }

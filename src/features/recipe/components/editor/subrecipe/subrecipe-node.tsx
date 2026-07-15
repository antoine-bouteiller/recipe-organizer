import { useQuery } from '@tanstack/solid-query'
import {
  $getNodeByKey,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedEditorState,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'
import { type JSX, Show } from 'solid-js'

import { Editor, EditorContent, useEditor } from '@/components/common/editor'
import { Spinner } from '@/components/ui/spinner'
import { getRecipeInstructionsOptions } from '@/features/recipe/api/get-instructions'
import { type SubrecipeNodeData } from '@/features/recipe/types/subrecipe'

import { recipeNodes } from '../extensions'
import { SubrecipeDialog } from './subrecipe-dialog'

type SerializedSubrecipeNode = Spread<
  {
    hideFirstNodes: number
    hideLastNodes: number
    recipeId: number
    type: 'subrecipe'
    version: 1
  },
  SerializedLexicalNode
>

const $createSubrecipeNode = (data: SubrecipeNodeData): SubrecipeNodeType =>
  new SubrecipeNodeType(data.recipeId, data.hideFirstNodes, data.hideLastNodes)

const $isSubrecipeNode = (node: LexicalNode | null | undefined): node is SubrecipeNodeType => node instanceof SubrecipeNodeType

const filterNodes = (state: string, hideFirstNodes: number, hideLastNodes: number): string => {
  const parsedState = JSON.parse(state) as SerializedEditorState
  const { children } = parsedState.root
  const totalNodes = children.length - 1
  const startIndex = hideFirstNodes ?? 0
  const endIndex = hideLastNodes === undefined ? totalNodes : totalNodes - hideLastNodes

  if (startIndex >= endIndex || startIndex >= totalNodes) {
    return JSON.stringify({ root: { ...parsedState.root, children: [] } })
  }

  return JSON.stringify({ root: { ...parsedState.root, children: children.slice(startIndex, endIndex) } })
}

const SubrecipeInstructionsContent = (props: { hideFirstNodes: number; hideLastNodes: number; instructions: string }) => (
  <Editor content={filterNodes(props.instructions, props.hideFirstNodes, props.hideLastNodes)} nodes={recipeNodes} readOnly>
    <EditorContent class="pl-4" />
  </Editor>
)

interface SubrecipeComponentProps {
  hideFirstNodes: number
  hideLastNodes: number
  isEditable: boolean
  nodeKey: NodeKey
  recipeId: number
}

const SubrecipeComponent = (props: SubrecipeComponentProps) => {
  const editor = useEditor()
  const query = useQuery(() => getRecipeInstructionsOptions(props.recipeId))

  const updateAttributes = (data: SubrecipeNodeData) => {
    editor.update(() => {
      const node = $getNodeByKey(props.nodeKey)
      if ($isSubrecipeNode(node)) {
        const writable = node.getWritable()
        writable.__recipeId = data.recipeId
        writable.__hideFirstNodes = data.hideFirstNodes
        writable.__hideLastNodes = data.hideLastNodes
      }
    })
  }

  return (
    <Show when={query.data} keyed>
      {(recipe) => {
        const preview = (
          <>
            <p>
              <strong>{recipe.name}</strong>
            </p>
            <Show
              fallback={
                <div class="flex items-center justify-center py-4">
                  <Spinner />
                </div>
              }
              when={!query.isLoading}
            >
              <SubrecipeInstructionsContent
                hideFirstNodes={props.hideFirstNodes}
                hideLastNodes={props.hideLastNodes}
                instructions={recipe.instructions}
              />
            </Show>
          </>
        )

        return (
          <Show fallback={preview} when={props.isEditable}>
            <SubrecipeDialog
              initialData={{ hideFirstNodes: props.hideFirstNodes, hideLastNodes: props.hideLastNodes, recipeId: props.recipeId }}
              onSubmit={updateAttributes}
              submitLabel="Enregistrer"
              title="Modifier la sous-recette"
              trigger={{
                as: 'div',
                children: preview,
                class: 'w-full cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/30 p-4 text-start',
              }}
            />
          </Show>
        )
      }}
    </Show>
  )
}

class SubrecipeNodeType extends DecoratorNode<() => JSX.Element> {
  __recipeId: number
  __hideFirstNodes: number
  __hideLastNodes: number

  static getType(): string {
    return 'subrecipe'
  }

  static clone(node: SubrecipeNodeType): SubrecipeNodeType {
    return new SubrecipeNodeType(node.__recipeId, node.__hideFirstNodes, node.__hideLastNodes, node.__key)
  }

  constructor(recipeId: number, hideFirstNodes: number, hideLastNodes: number, key?: NodeKey) {
    super(key)
    this.__recipeId = recipeId
    this.__hideFirstNodes = hideFirstNodes
    this.__hideLastNodes = hideLastNodes
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (domNode.getAttribute('data-type') !== 'subrecipe') {
          return null
        }
        return {
          conversion: (element: HTMLElement): DOMConversionOutput => {
            const recipeId = Number.parseInt(element.dataset.recipeId ?? '0', 10)
            const hideFirst = element.dataset.hideFirstNodes ? Number.parseInt(element.dataset.hideFirstNodes, 10) : 0
            const hideLast = element.dataset.hideLastNodes ? Number.parseInt(element.dataset.hideLastNodes, 10) : 0
            return { node: new SubrecipeNodeType(recipeId, hideFirst, hideLast) }
          },
          priority: 1,
        }
      },
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute('data-type', 'subrecipe')
    element.setAttribute('data-recipe-id', String(this.__recipeId))
    if (this.__hideFirstNodes !== 0) {
      element.setAttribute('data-hide-first-nodes', String(this.__hideFirstNodes))
    }
    if (this.__hideLastNodes !== 0) {
      element.setAttribute('data-hide-last-nodes', String(this.__hideLastNodes))
    }
    return { element }
  }

  exportJSON(): SerializedSubrecipeNode {
    return {
      ...super.exportJSON(),
      hideFirstNodes: this.__hideFirstNodes,
      hideLastNodes: this.__hideLastNodes,
      recipeId: this.__recipeId,
      type: 'subrecipe',
      version: 1,
    }
  }

  static importJSON(json: SerializedSubrecipeNode): SubrecipeNodeType {
    return new SubrecipeNodeType(json.recipeId, json.hideFirstNodes, json.hideLastNodes)
  }

  isInline(): boolean {
    return false
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div')
    div.style.display = 'contents'
    return div
  }

  updateDOM(): boolean {
    return false
  }

  decorate(editor: LexicalEditor): () => JSX.Element {
    return () => (
      <SubrecipeComponent
        hideFirstNodes={this.__hideFirstNodes}
        hideLastNodes={this.__hideLastNodes}
        isEditable={editor.isEditable()}
        nodeKey={this.__key}
        recipeId={this.__recipeId}
      />
    )
  }
}

export { $createSubrecipeNode, SubrecipeNodeType as SubrecipeNode }

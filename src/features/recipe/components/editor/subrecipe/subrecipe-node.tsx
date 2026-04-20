import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useQuery } from '@tanstack/react-query'
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

import { Editor, EditorContent } from '@/components/ui/editor'
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

const SubrecipeInstructionsContent = ({
  hideFirstNodes,
  hideLastNodes,
  instructions,
}: {
  hideFirstNodes: number
  hideLastNodes: number
  instructions: string
}) => {
  const filteredInstructions = filterNodes(instructions, hideFirstNodes, hideLastNodes)

  return (
    <Editor content={filteredInstructions} nodes={recipeNodes} readOnly>
      <EditorContent className="pl-4" />
    </Editor>
  )
}

interface SubrecipeComponentProps {
  hideFirstNodes: number
  hideLastNodes: number
  isEditable: boolean
  nodeKey: NodeKey
  recipeId: number
}

const SubrecipeComponent = ({ hideFirstNodes, hideLastNodes, isEditable, nodeKey, recipeId }: SubrecipeComponentProps) => {
  const [editor] = useLexicalComposerContext()
  const { data: recipe, isLoading } = useQuery(getRecipeInstructionsOptions(recipeId))

  const formInitialValues: SubrecipeNodeData = {
    hideFirstNodes,
    hideLastNodes,
    recipeId,
  }

  const updateAttributes = (data: SubrecipeNodeData) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isSubrecipeNode(node)) {
        const writable = node.getWritable()
        writable.__recipeId = data.recipeId
        writable.__hideFirstNodes = data.hideFirstNodes
        writable.__hideLastNodes = data.hideLastNodes
      }
    })
  }

  if (!recipe) {
    return null
  }

  const content = (
    <>
      <p>
        <strong>{recipe.name}</strong>
      </p>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Spinner />
        </div>
      ) : (
        <SubrecipeInstructionsContent hideFirstNodes={hideFirstNodes} hideLastNodes={hideLastNodes} instructions={recipe.instructions} />
      )}
    </>
  )

  if (isEditable) {
    return (
      <SubrecipeDialog
        initialData={formInitialValues}
        onSubmit={updateAttributes}
        submitLabel="Enregistrer"
        title="Modifier la sous-recette"
        triggerRender={
          <div className="w-full cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/30 p-4 text-start">
            {content}
          </div>
        }
      />
    )
  }

  return content
}

class SubrecipeNodeType extends DecoratorNode<React.ReactElement> {
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

  decorate(editor: LexicalEditor): React.ReactElement {
    return (
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

import { useQuery } from '@tanstack/react-query'
import { mergeAttributes, Node, NodeViewWrapper, ReactNodeViewRenderer as reactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react'

import type { SubrecipeNodeData } from '@/components/tiptap/types/subrecipe'
import { getRecipeInstructionsOptions } from '@/features/recipe/api/get-instructions'

import { Spinner } from '../ui/spinner'
import { Tiptap, TiptapContent } from '../ui/tiptap'
import { SubrecipeDialog } from './subrecipe-dialog'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    subrecipe: {
      setSubrecipe: (attributes: SubrecipeNodeData) => ReturnType
    }
  }
}

interface WrapperProps {
  children: React.ReactNode
  initialData: SubrecipeNodeData
  isEditable: boolean
  updateAttributes: (attributes: SubrecipeNodeData) => void
}

const Wrapper = ({ children, initialData, isEditable, updateAttributes }: WrapperProps) =>
  isEditable ? (
    <SubrecipeDialog
      className="w-full"
      initialData={initialData}
      onSubmit={updateAttributes}
      submitLabel="Enregistrer"
      title="Modifier la sous-recette"
    >
      <div className="w-full cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/30 p-4 text-start">{children}</div>
    </SubrecipeDialog>
  ) : (
    children
  )
const filterNodes = (instructions: string, hideFirstNodes?: number, hideLastNodes?: number): string => {
  if (hideFirstNodes === undefined && hideLastNodes === undefined) {
    return instructions
  }

  try {
    const parsed = JSON.parse(instructions)
    if (!parsed?.content || !Array.isArray(parsed.content)) {
      return instructions
    }

    const totalNodes = parsed.content.length
    const startIndex = hideFirstNodes ?? 0
    const endIndex = hideLastNodes === undefined ? totalNodes : totalNodes - hideLastNodes

    if (startIndex >= endIndex || startIndex >= totalNodes) {
      return JSON.stringify({ ...parsed, content: [] })
    }

    const filteredContent = parsed.content.slice(startIndex, endIndex)
    return JSON.stringify({ ...parsed, content: filteredContent })
  } catch {
    return instructions
  }
}

const SubrecipeInstructionsContent = ({
  hideFirstNodes,
  hideLastNodes,
  instructions,
}: {
  hideFirstNodes?: number
  hideLastNodes?: number
  instructions?: string
}) => {
  if (instructions) {
    const filteredInstructions = filterNodes(instructions, hideFirstNodes, hideLastNodes)
    return (
      <Tiptap content={filteredInstructions} readOnly>
        <TiptapContent className="pl-4" />
      </Tiptap>
    )
  }
  return <div className="py-2 text-sm text-muted-foreground">Aucune instruction disponible</div>
}

const SubrecipeComponent = ({ editor, node, updateAttributes }: ReactNodeViewProps) => {
  const { hideFirstNodes, hideLastNodes, recipeId, recipeName } = node.attrs as SubrecipeNodeData

  const { data: recipe, isLoading } = useQuery(getRecipeInstructionsOptions(recipeId))

  const formInitialValues: SubrecipeNodeData = {
    hideFirstNodes,
    hideLastNodes,
    recipeId,
    recipeName,
  }

  return (
    <NodeViewWrapper>
      <Wrapper initialData={formInitialValues} isEditable={editor.isEditable} updateAttributes={updateAttributes}>
        <p>
          <strong>{recipe?.name}</strong>
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <SubrecipeInstructionsContent hideFirstNodes={hideFirstNodes} hideLastNodes={hideLastNodes} instructions={recipe?.instructions} />
        )}
      </Wrapper>
    </NodeViewWrapper>
  )
}

export const SubrecipeNode = Node.create<Record<string, never>>({
  addAttributes() {
    return {
      hideFirstNodes: {
        default: undefined,
        parseHTML: (element) => {
          const value = element.dataset.hideFirstNodes
          return value ? Number.parseInt(value, 10) : undefined
        },
        renderHTML: (attributes) => {
          const value = attributes.hideFirstNodes as number | undefined
          return value ? { 'data-hide-first-nodes': String(value) } : {}
        },
      },
      hideLastNodes: {
        default: undefined,
        parseHTML: (element) => {
          const value = element.dataset.hideLastNodes
          return value ? Number.parseInt(value, 10) : undefined
        },
        renderHTML: (attributes) => {
          const value = attributes.hideLastNodes as number | undefined
          return value ? { 'data-hide-last-nodes': String(value) } : {}
        },
      },
      recipeId: {
        parseHTML: (element) => {
          const id = element.dataset.recipeId
          return id ? Number.parseInt(id, 10) : undefined
        },
        renderHTML: (attributes) => ({
          'data-recipe-id': String(attributes.recipeId),
        }),
      },
      recipeName: {
        default: '',
        parseHTML: (element) => element.dataset.recipeName,
        renderHTML: (attributes) => ({
          'data-recipe-name': attributes.recipeName as string,
        }),
      },
    }
  },

  addCommands() {
    return {
      setSubrecipe:
        (attributes: SubrecipeNodeData) =>
        ({ commands }) =>
          commands.insertContent({
            attrs: attributes,
            type: this.name,
          }),
    }
  },

  addNodeView() {
    return reactNodeViewRenderer(SubrecipeComponent)
  },

  draggable: true,

  group: 'block',

  name: 'subrecipe',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="subrecipe"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'subrecipe' })]
  },
})

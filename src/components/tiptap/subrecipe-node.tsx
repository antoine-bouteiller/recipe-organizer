import { useQuery } from '@tanstack/react-query'
import { mergeAttributes, Node } from '@tiptap/core'
import { NodeViewWrapper, type ReactNodeViewProps, ReactNodeViewRenderer as reactNodeViewRenderer } from '@tiptap/react'

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
const SubrecipeInstructionsContent = ({ instructions }: { instructions?: string }) => {
  if (instructions) {
    return (
      <Tiptap content={instructions} readOnly>
        <TiptapContent className="pl-4" />
      </Tiptap>
    )
  }
  return <div className="py-2 text-sm text-muted-foreground">Aucune instruction disponible</div>
}

const SubrecipeComponent = ({ editor, node, updateAttributes }: ReactNodeViewProps) => {
  const { recipeId, recipeName } = node.attrs as SubrecipeNodeData

  const { data: recipe, isLoading } = useQuery(getRecipeInstructionsOptions(recipeId))

  const formInitialValues: SubrecipeNodeData = {
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
          <SubrecipeInstructionsContent instructions={recipe?.instructions} />
        )}
      </Wrapper>
    </NodeViewWrapper>
  )
}

export const SubrecipeNode = Node.create<Record<string, never>>({
  addAttributes() {
    return {
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

interface SerializedNode {
  recipeId?: unknown
  type?: unknown
}

const isSerializedNode = (value: unknown): value is SerializedNode => typeof value === 'object' && value !== null

/** Returns the recipe IDs referenced by subrecipe nodes in a serialized Lexical state. */
export const getSubrecipeRecipeIds = (instructions: string | undefined): number[] => {
  if (!instructions) {
    return []
  }

  try {
    const recipeIds = new Set<number>()
    const nodes: unknown[] = [JSON.parse(instructions)]

    while (nodes.length > 0) {
      const node = nodes.pop()

      if (Array.isArray(node)) {
        nodes.push(...node)
      } else if (isSerializedNode(node)) {
        if (node.type === 'subrecipe' && typeof node.recipeId === 'number' && Number.isSafeInteger(node.recipeId) && node.recipeId > 0) {
          recipeIds.add(node.recipeId)
        }
        nodes.push(...Object.values(node))
      }
    }

    return [...recipeIds]
  } catch {
    return []
  }
}

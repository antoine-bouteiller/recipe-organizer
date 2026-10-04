import { defineRule } from 'vite-plus/lint/plugins'
import type { ESTree, Scope, SourceCode } from 'vite-plus/lint/plugins'

const isVoidUseShared = (sourceCode: SourceCode, identifier: ESTree.IdentifierReference): boolean => {
  let scope: Scope | undefined = sourceCode.getScope(identifier) ?? undefined
  while (scope !== undefined) {
    const variable = scope.set.get(identifier.name)
    if (variable !== undefined) {
      return variable.defs.some(
        (definition) =>
          definition.type === 'ImportBinding' &&
          definition.parent?.type === 'ImportDeclaration' &&
          definition.parent.source.value === '@void/svelte' &&
          definition.parent.importKind !== 'type' &&
          definition.node.type === 'ImportSpecifier' &&
          definition.node.importKind !== 'type' &&
          (definition.node.imported.type === 'Identifier' ? definition.node.imported.name : definition.node.imported.value) === 'useShared'
      )
    }
    scope = scope.upper ?? undefined
  }
  return false
}

/** Keep Void's shared navigation context live instead of capturing its current properties. */
export const noUseSharedDestructuringRule = defineRule({
  createOnce(context) {
    return {
      CallExpression(node) {
        const { parent } = node
        let pattern: ESTree.Node | undefined = undefined
        if (parent.type === 'VariableDeclarator' && parent.init === node) {
          pattern = parent.id
        } else if (parent.type === 'AssignmentExpression' && parent.right === node) {
          pattern = parent.left
        }
        if (
          (pattern?.type === 'ObjectPattern' || pattern?.type === 'ArrayPattern') &&
          node.callee.type === 'Identifier' &&
          isVoidUseShared(context.sourceCode, node.callee)
        ) {
          context.report({ messageId: 'sharedDestructuring', node: pattern })
        }
      },
    }
  },
  meta: {
    docs: {
      description: 'Disallow direct destructuring of the imported Void Svelte useShared() result.',
    },
    messages: {
      sharedDestructuring:
        'Keep the object returned by useShared() and read its properties reactively; destructuring captures a stale navigation snapshot.',
    },
    type: 'problem',
  },
})

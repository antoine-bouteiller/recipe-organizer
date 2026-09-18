import { defineRule, type ESTree } from '@oxlint/plugins'

// oxlint-disable-next-line complexity -- Each AST declaration form needs its own ownership check.
const isLocalDefinition = (node: ESTree.Node): boolean => {
  const { parent } = node
  if (parent == null) {
    return false
  }
  switch (parent.type) {
    case 'VariableDeclarator': {
      return parent.id === node
    }
    case 'AssignmentPattern': {
      return parent.left === node && isLocalDefinition(parent)
    }
    case 'RestElement': {
      return parent.argument === node && isLocalDefinition(parent)
    }
    case 'ArrayPattern':
    case 'ObjectPattern':
    case 'TSParameterProperty': {
      return isLocalDefinition(parent)
    }
    case 'Property': {
      return parent.parent?.type === 'ObjectPattern' && !parent.shorthand && parent.value === node && isLocalDefinition(parent.parent)
    }
    case 'FunctionDeclaration':
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
    case 'TSDeclareFunction':
    case 'TSEmptyBodyFunctionExpression':
    case 'TSFunctionType':
    case 'TSConstructorType':
    case 'TSCallSignatureDeclaration':
    case 'TSConstructSignatureDeclaration': {
      return ('id' in parent && parent.id === node) || parent.params.some((parameter) => parameter === node)
    }
    case 'CatchClause': {
      return parent.param === node
    }
    case 'ClassDeclaration':
    case 'ClassExpression':
    case 'TSTypeAliasDeclaration':
    case 'TSInterfaceDeclaration':
    case 'TSEnumDeclaration':
    case 'TSEnumMember':
    case 'TSModuleDeclaration': {
      return parent.id === node
    }
    case 'TSTypeParameter': {
      return parent.name === node
    }
    case 'ImportDefaultSpecifier':
    case 'ImportNamespaceSpecifier': {
      return parent.local === node
    }
    case 'ImportSpecifier': {
      return parent.local === node && (parent.imported.type !== 'Identifier' || parent.imported.name !== parent.local.name)
    }
    case 'PropertyDefinition':
    case 'AccessorProperty':
    case 'MethodDefinition': {
      const owner = parent.parent?.parent
      return (
        (!parent.computed || node.type === 'Literal') &&
        parent.key === node &&
        (node.type === 'PrivateIdentifier' ||
          ((owner?.type === 'ClassDeclaration' || owner?.type === 'ClassExpression') &&
            owner.superClass == null &&
            (owner.implements?.length ?? 0) === 0))
      )
    }
    case 'TSMethodSignature':
    case 'TSPropertySignature': {
      if (parent.type === 'TSMethodSignature' && parent.params.some((parameter) => parameter === node)) {
        return true
      }
      const owner = parent.parent?.parent
      return (
        (!parent.computed || node.type === 'Literal') &&
        parent.key === node &&
        (owner?.type !== 'TSInterfaceDeclaration' || owner.extends.length === 0)
      )
    }
    default: {
      return false
    }
  }
}

const isAmbient = (node: ESTree.Node): boolean => {
  let current: ESTree.Node | undefined = node
  while (current !== undefined) {
    if ('declare' in current && current.declare) {
      return true
    }
    current = current.parent ?? undefined
  }
  return false
}

/** Ban structural filler and numeric suffixes in names defined locally, not external API names. */
export const noLowSignalSymbolNamesRule = defineRule({
  createOnce(context) {
    const reportForbiddenSymbolName = (node: ESTree.Node) => {
      const value = node.type === 'Literal' ? node.value : undefined
      const name = 'name' in node ? node.name : value
      if (typeof name !== 'string') {
        return
      }
      const containsForbiddenTerm = name.toLowerCase().includes('shape')
      const hasNumericSuffix = /\d$/u.test(name)
      if ((!containsForbiddenTerm && !hasNumericSuffix) || !isLocalDefinition(node) || isAmbient(node)) {
        return
      }
      context.report({
        data: { name },
        messageId: containsForbiddenTerm ? 'forbiddenSymbolName' : 'numericSuffix',
        node,
      })
    }

    return {
      Identifier: reportForbiddenSymbolName,
      Literal: reportForbiddenSymbolName,
      PrivateIdentifier: reportForbiddenSymbolName,
    }
  },
  meta: {
    docs: {
      description: 'Disallow the case-insensitive substring "shape" and numeric suffixes in locally defined symbol names.',
    },
    messages: {
      forbiddenSymbolName: 'Rename symbol "{{name}}" for its domain role; "shape" describes structure rather than ownership.',
      numericSuffix: 'Rename symbol "{{name}}" for its domain role rather than distinguishing it with a numeric suffix.',
    },
    type: 'problem',
  },
})

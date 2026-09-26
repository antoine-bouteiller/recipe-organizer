import { defineRule } from '@oxlint/plugins'
import type { ESTree } from '@oxlint/plugins'

const isIdentifier = (node: ESTree.Node, name: string): boolean => node.type === 'Identifier' && node.name === name

const spacingProperties = new Set<string>([
  'columnGap',
  'gap',
  'margin',
  'marginBlock',
  'marginBlockEnd',
  'marginBlockStart',
  'marginBottom',
  'marginInline',
  'marginInlineEnd',
  'marginInlineStart',
  'marginLeft',
  'marginRight',
  'marginTop',
  'padding',
  'paddingBlock',
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingBottom',
  'paddingInline',
  'paddingInlineEnd',
  'paddingInlineStart',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'rowGap',
])

const radiusProperties = new Set<string>([
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderEndEndRadius',
  'borderEndStartRadius',
  'borderRadius',
  'borderStartEndRadius',
  'borderStartStartRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
])

const fontSizeProperties = new Set<string>(['fontSize'])

const fontWeightProperties = new Set<string>(['fontWeight'])

const boxShadowProperties = new Set<string>(['boxShadow'])

const isThemeSpacingCall = (node: ESTree.Node): boolean =>
  node.type === 'CallExpression' &&
  node.callee.type === 'MemberExpression' &&
  !node.callee.computed &&
  isIdentifier(node.callee.object, 'theme') &&
  isIdentifier(node.callee.property, 'spacing')

const isThemeSafeAreaMember = (node: ESTree.Node): boolean =>
  isThemeNamespaceMember(node, 'safeArea') &&
  node.type === 'MemberExpression' &&
  !node.computed &&
  (isIdentifier(node.property, 'top') || isIdentifier(node.property, 'bottom'))

const isSingleValueThemeSpacingCall = (node: ESTree.Node): boolean =>
  node.type === 'CallExpression' && node.arguments.length === 1 && isThemeSpacingCall(node)

const isSafeAreaSpacingCalc = (node: ESTree.Node): boolean => {
  if (node.type !== 'TemplateLiteral' || node.expressions.length !== 2 || node.quasis.length !== 3) {
    return false
  }

  const [prefix, separator, suffix] = node.quasis
  if (prefix.value.raw !== 'calc(' || separator.value.raw !== ' + ' || suffix.value.raw !== ')') {
    return false
  }

  const [left, right] = node.expressions
  return (
    (isThemeSafeAreaMember(left) && isSingleValueThemeSpacingCall(right)) || (isSingleValueThemeSpacingCall(left) && isThemeSafeAreaMember(right))
  )
}

const isAutoMargin = (node: ESTree.Node, propertyName: string): boolean =>
  propertyName.startsWith('margin') && node.type === 'Literal' && node.value === 'auto'

const isVanillaExtractVar = (node: ESTree.Node): boolean => node.type === 'Identifier' && node.name.endsWith('Var')

const hasFallbackVarToken = (node: ESTree.Node, isThemeToken: (node: ESTree.Node) => boolean): boolean => {
  if (node.type !== 'CallExpression' || !isIdentifier(node.callee, 'fallbackVar') || node.arguments.length < 2) {
    return false
  }

  const terminalFallback = node.arguments.at(-1)
  return terminalFallback !== undefined && isThemeToken(terminalFallback)
}

const isThemeNamespaceMember = (node: ESTree.Node, namespace: string): boolean => {
  if (node.type !== 'MemberExpression') {
    return false
  }

  const { object } = node

  return object.type === 'MemberExpression' && !object.computed && isIdentifier(object.object, 'theme') && isIdentifier(object.property, namespace)
}

const isValidSpacingValue = (node: ESTree.Node, propertyName: string): boolean =>
  isTokenOrFallback(node, isThemeSpacingCall) ||
  isThemeSafeAreaMember(node) ||
  isSafeAreaSpacingCalc(node) ||
  isAutoMargin(node, propertyName) ||
  isVanillaExtractVar(node)

const isTokenOrFallback = (node: ESTree.Node, isThemeToken: (node: ESTree.Node) => boolean): boolean =>
  isThemeToken(node) || hasFallbackVarToken(node, isThemeToken)

const getPropertyName = (key: ESTree.Node, computed: boolean): string | undefined => {
  if (!computed && key.type === 'Identifier') {
    return key.name
  }
  if (key.type === 'Literal' && typeof key.value === 'string') {
    return key.value
  }
  return undefined
}

const isThemeRadiusMember = (node: ESTree.Node): boolean => isThemeNamespaceMember(node, 'radius')

const isThemeFontWeightMember = (node: ESTree.Node): boolean => isThemeNamespaceMember(node, 'fontWeights')

const isThemeShadowMember = (node: ESTree.Node): boolean => isThemeNamespaceMember(node, 'shadows')

const isThemeTypographyFontSize = (node: ESTree.Node): boolean => isThemeNamespaceMember(node, 'fontSizes')

export const vanillaExtractThemeTokensRule = defineRule({
  createOnce(context) {
    return {
      Property(node) {
        const propertyName = getPropertyName(node.key, node.computed)
        if (!propertyName) {
          return
        }

        if (node.value.type === 'ObjectExpression') {
          return
        }

        if (spacingProperties.has(propertyName) && !isValidSpacingValue(node.value, propertyName)) {
          context.report({
            message: `Use theme.spacing(...) or theme.safeArea.top/bottom for ${propertyName}.`,
            node: node.value,
          })
          return
        }

        if (radiusProperties.has(propertyName) && !isTokenOrFallback(node.value, isThemeRadiusMember)) {
          context.report({
            message: `Use theme.radius.* for ${propertyName}.`,
            node: node.value,
          })
          return
        }

        if (fontSizeProperties.has(propertyName) && !isTokenOrFallback(node.value, isThemeTypographyFontSize)) {
          context.report({
            message: `Use theme.fontSizes.* for ${propertyName}.`,
            node: node.value,
          })
          return
        }

        if (fontWeightProperties.has(propertyName) && !isTokenOrFallback(node.value, isThemeFontWeightMember)) {
          context.report({
            message: `Use theme.fontWeights.* for ${propertyName}.`,
            node: node.value,
          })
          return
        }

        if (boxShadowProperties.has(propertyName) && !isTokenOrFallback(node.value, isThemeShadowMember)) {
          context.report({
            message: `Use theme.shadows.* for ${propertyName}.`,
            node: node.value,
          })
        }
      },
    }
  },
  meta: {
    docs: {
      description: 'Require vanilla-extract spacing, radius, font-size, font-weight, and box-shadow properties to use Phoenix theme tokens.',
    },
    schema: [],
    type: 'problem',
  },
})

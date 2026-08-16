import { eslintCompatPlugin } from '@oxlint/plugins'

import { noConditionalEmptyObjectSpreadRule } from './rules/no-conditional-empty-object-spread.ts'
import { noKnownValueWideningRule } from './rules/no-known-value-widening.ts'
import { noModuleMockingRule } from './rules/no-module-mocking.ts'
import { noObjectParametersRule } from './rules/no-object-parameters.ts'
import { noForbiddenTermInSymbolNamesRule } from './rules/no-shape-in-symbol-names.ts'
import { noUnknownTypeAliasesRule } from './rules/no-unknown-type-aliases.ts'
import { noUnsafeDictionaryTypeRule } from './rules/no-unsafe-dictionary-type.ts'

/** Generic Oxlint rules that reject low-evidence and low-signal implementation patterns. */
const recipeOrganizerPlugin = eslintCompatPlugin({
  meta: { name: 'recipe-organizer' },
  rules: {
    'no-conditional-empty-object-spread': noConditionalEmptyObjectSpreadRule,
    'no-known-value-widening': noKnownValueWideningRule,
    'no-module-mocking': noModuleMockingRule,
    'no-object-parameters': noObjectParametersRule,
    'no-shape-in-symbol-names': noForbiddenTermInSymbolNamesRule,
    'no-unknown-type-aliases': noUnknownTypeAliasesRule,
    'no-unsafe-dictionary-type': noUnsafeDictionaryTypeRule,
  },
})

export default recipeOrganizerPlugin

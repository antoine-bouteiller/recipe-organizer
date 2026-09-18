import { eslintCompatPlugin } from '@oxlint/plugins'

import { noConditionalEmptyObjectSpreadRule } from './rules/no-conditional-empty-object-spread.ts'
import { noKnownValueWideningRule } from './rules/no-known-value-widening.ts'
import { noLowSignalSymbolNamesRule } from './rules/no-low-signal-symbol-names.ts'
import { noModuleMockingRule } from './rules/no-module-mocking.ts'
import { noObjectParametersRule } from './rules/no-object-parameters.ts'
import { noUnknownTypeAliasesRule } from './rules/no-unknown-type-aliases.ts'
import { noUnsafeDictionaryTypeRule } from './rules/no-unsafe-dictionary-type.ts'
import { vanillaExtractThemeTokensRule } from './rules/vanilla-extract-theme-tokens.ts'

/** Generic Oxlint rules that reject low-evidence and low-signal implementation patterns. */
const recipeOrganizerPlugin = eslintCompatPlugin({
  meta: { name: 'recipe-organizer' },
  rules: {
    'no-conditional-empty-object-spread': noConditionalEmptyObjectSpreadRule,
    'no-known-value-widening': noKnownValueWideningRule,
    'no-low-signal-symbol-names': noLowSignalSymbolNamesRule,
    'no-module-mocking': noModuleMockingRule,
    'no-object-parameters': noObjectParametersRule,
    'no-unknown-type-aliases': noUnknownTypeAliasesRule,
    'no-unsafe-dictionary-type': noUnsafeDictionaryTypeRule,
    'vanilla-extract-theme-tokens': vanillaExtractThemeTokensRule,
  },
})

export default recipeOrganizerPlugin

import { RuleTester } from 'oxlint/plugins-dev'

import { vanillaExtractThemeTokensRule } from './vanilla-extract-theme-tokens.ts'

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } })
const spacingError = { message: /theme\.spacing/ }
const radiusError = { message: /theme\.radius/ }
const fontSizeError = { message: /theme\.fontSizes/ }
const fontWeightError = { message: /theme\.fontWeights/ }
const shadowError = { message: /theme\.shadows/ }

tester.run('recipe-organizer/vanilla-extract-theme-tokens', vanillaExtractThemeTokensRule, {
  invalid: [
    { code: "const style = { padding: '8px' }", errors: [spacingError] },
    { code: "const style = { borderRadius: 'inherit' }", errors: [radiusError] },
    { code: "const style = { boxShadow: 'none' }", errors: [shadowError] },
    { code: `const style = { padding: \`calc(\${theme.spacing(3)} - 1px)\` }`, errors: [spacingError] },
    { code: "const style = { paddingBottom: 'env(safe-area-inset-bottom, 0px)' }", errors: [spacingError] },
    { code: 'const style = { padding: theme.safeArea.left }', errors: [spacingError] },
    { code: 'const style = { padding: theme.safeArea[top] }', errors: [spacingError] },
    {
      code: `const style = { padding: \`calc(\${theme.safeArea.bottom} + \${theme.spacing(1, 2)})\` }`,
      errors: [spacingError],
    },
    { code: `const style = { padding: \`calc(\${theme.safeArea.bottom} + 8px)\` }`, errors: [spacingError] },
    { code: `const style = { padding: \`calc(\${theme.safeArea.bottom} + \${spacingVar})\` }`, errors: [spacingError] },
    {
      code: `const style = { borderRadius: \`calc(\${theme.safeArea.bottom} + \${theme.spacing(2)})\` }`,
      errors: [radiusError],
    },
    { code: "const style = { 'padding': '8px' }", errors: [spacingError] },
    { code: "const style = { ['padding']: '8px' }", errors: [spacingError] },
    { code: 'const style = { gap: spacingScale.small }', errors: [spacingError] },
    // `auto` is a margin escape only.
    { code: "const style = { paddingLeft: 'auto' }", errors: [spacingError] },
    { code: "const style = { borderTopLeftRadius: '4px' }", errors: [radiusError] },
    { code: "const style = { fontSize: '12px' }", errors: [fontSizeError] },
    { code: 'const style = { fontSize: theme.fontSizes }', errors: [fontSizeError] },
    { code: 'const style = { fontWeight: 700 }', errors: [fontWeightError] },
    { code: "const style = { boxShadow: '0 0 2px black' }", errors: [shadowError] },
    { code: "const style = { padding: fallbackVar(groupPadding, '0px') }", errors: [spacingError] },
    { code: 'const style = { padding: fallbackVar(groupPadding) }', errors: [spacingError] },
    {
      code: 'const style = { padding: fallbackVar(groupPadding, theme.radius.small) }',
      errors: [spacingError],
    },
    {
      code: "const style = { borderRadius: fallbackVar(radiusVar, '4px') }",
      errors: [radiusError],
    },
    {
      code: 'const style = { fontSize: fallbackVar(fontSizeVar, theme.fontWeight.bold) }',
      errors: [fontSizeError],
    },
    {
      code: 'const style = { fontWeight: fallbackVar(fontWeightVar) }',
      errors: [fontWeightError],
    },
    {
      code: 'const style = { boxShadow: fallbackVar(shadowVar, theme.radius.small) }',
      errors: [shadowError],
    },
  ],
  valid: [
    'const style = { padding: theme.spacing(2) }',
    'const style = { paddingTop: theme.safeArea.top }',
    'const style = { paddingBottom: theme.safeArea.bottom }',
    `const style = { paddingBottom: \`calc(\${theme.safeArea.bottom} + \${theme.spacing(4)})\` }`,
    `const style = { paddingBottom: \`calc(\${theme.spacing(4)} + \${theme.safeArea.bottom})\` }`,
    "const style = { [padding]: '8px' }",
    "const style = { [getProperty()]: '8px' }",
    'const style = { padding: { padding: theme.spacing(2) } }',
    "const style = { marginLeft: 'auto' }",
    'const style = { rowGap: gridGapVar }',
    'const style = { borderRadius: theme.radius.md }',
    'const style = { borderRadius: theme.radius.none }',
    'const style = { borderRadius: theme.radius.inherit }',
    'const style = { fontSize: theme.fontSizes.base }',
    'const style = { fontSize: theme.fontSizes.inherit }',
    'const style = { fontWeight: theme.fontWeights.bold }',
    'const style = { fontWeight: theme.fontWeights.inherit }',
    'const style = { boxShadow: theme.shadows.sm }',
    'const style = { boxShadow: theme.shadows.none }',
    'const style = { padding: fallbackVar(groupPadding, theme.spacing(0)) }',
    'const style = { padding: fallbackVar(horizontalPaddingVar, verticalPaddingVar, theme.spacing(2)) }',
    'const style = { borderRadius: fallbackVar(radiusVar, theme.radius.md) }',
    'const style = { fontSize: fallbackVar(fontSizeVar, theme.fontSizes.base) }',
    'const style = { fontWeight: fallbackVar(fontWeightVar, theme.fontWeights.bold) }',
    'const style = { boxShadow: fallbackVar(shadowVar, theme.shadows.sm) }',
    "const style = { color: 'red' }",
    // A nested object is a selector or media-query block, checked by its own properties.
    "const style = { '@media': { padding: theme.spacing(1) } }",
  ],
})

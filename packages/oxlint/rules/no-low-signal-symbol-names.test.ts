import { RuleTester } from 'oxlint/plugins-dev'

import { noLowSignalSymbolNamesRule } from './no-low-signal-symbol-names.ts'

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'tsx' } } })
const suffixError = { messageId: 'numericSuffix' }
const termError = { messageId: 'forbiddenSymbolName' }

tester.run('recipe-organizer/no-low-signal-symbol-names', noLowSignalSymbolNamesRule, {
  invalid: [
    { code: 'const container2 = 0; console.log(container2);', errors: [suffixError] },
    { code: 'let item0, item123;', errors: [suffixError, suffixError] },
    { code: 'const recipeShape = {}; recipeShape;', errors: [termError] },
    { code: 'function RESHAPED() {}', errors: [termError] },
    { code: 'function cook2(input3, ...rest4) {}', errors: [suffixError, suffixError, suffixError] },
    { code: 'const cook = (input2 = 0) => input2;', errors: [suffixError] },
    { code: 'const [item2] = items;', errors: [suffixError] },
    { code: 'const { external: local2, ...rest3 } = source;', errors: [suffixError, suffixError] },
    { code: 'const { nested: { external: localShape } } = source;', errors: [termError] },
    { code: 'try {} catch (error2) {}', errors: [suffixError] },
    { code: "import { item as item2 } from 'api';", errors: [suffixError] },
    { code: "import Shape from 'api';", errors: [termError] },
    { code: "import * as api2 from 'api';", errors: [suffixError] },
    { code: 'class Recipe2 {}', errors: [suffixError] },
    { code: 'class Recipe { #value2; methodShape() {} }', errors: [suffixError, termError] },
    { code: 'class Recipe { value2; method3() {} }', errors: [suffixError, suffixError] },
    { code: 'class Recipe { ["value2"]; ["getShape"]() {} }', errors: [suffixError, termError] },
    { code: 'class Recipe extends External { #value2; }', errors: [suffixError] },
    { code: 'class Recipe { constructor(private value2: string) {} }', errors: [suffixError] },
    { code: 'type Recipe2 = string; interface RecipeShape {}', errors: [suffixError, termError] },
    { code: 'type Recipe<Value2> = Value2;', errors: [suffixError] },
    { code: 'enum Status2 { Ready2 }', errors: [suffixError, suffixError] },
    { code: 'namespace Recipe2 {}', errors: [suffixError] },
    { code: 'interface Recipe { value2: string; getShape(): void }', errors: [suffixError, termError] },
    { code: 'type Recipe = { "value2": string; ["getShape"](): void };', errors: [suffixError, termError] },
    { code: 'const { external: local2 = 0 } = source;', errors: [suffixError] },
    { code: 'const item = function cook2() {}; const recipe = class Recipe2 {};', errors: [suffixError, suffixError] },
  ],
  valid: [
    'const container = 2; const version2Label = "shape2";',
    'api.shape; Math.log2(8); new ExternalShape();',
    'const heading = <h1 data-version2="2"><ExternalShape shape={value} /></h1>;',
    "import { Shape, api2 } from 'api'; Shape; api2();",
    "import { Shape as Recipe } from 'api';",
    "export { Shape, api2 } from 'api';",
    'const { shape, api2, nested: { value2 = 0 } } = external;',
    'const { shape: recipe, api2: api } = external;',
    'type Recipe = ExternalShape; const recipe: Shape = external;',
    'style({ cornerShape: "squircle", h1: { fontSize: 20 } });',
    'const cardCorners = { cornerShape: "squircle" }; style(cardCorners);',
    'const recipe = { container2: {}, nested: { recipeShape: true } };',
    'const recipe = { "container2": true };',
    'const options: ExternalOptions = { shape: "circle", version2: true };',
    'const options = { shape: "circle" } satisfies ExternalOptions;',
    'const options = { shape: "circle" } as ExternalOptions;',
    'declare const externalShape: string;',
    'declare module "api" { export interface Shape { value2: string } }',
    'class Recipe extends External { override shape() {} }',
    'class Recipe implements External { shape() {} }',
    'interface Recipe extends External { shape(): void; value2: string }',
    'class Recipe { [externalShape]() {} }',
  ],
})

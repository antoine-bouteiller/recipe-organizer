---
title: Design-System Styling and Ownership
status: amended
author: Antoine Bouteiller
date: 2026-09-16
related:
  [
    AGENTS.md,
    packages/design-system/src/theme/index.ts,
    packages/design-system/src/theme/tokens.css.ts,
    docs/file-structure.spec.md,
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/client/routing-ssr.spec.md,
  ]
---

## 2. Problem Statement

Reusable UI must retain its visual and structural ownership while web features retain their own
layout and domain presentation. The design system and Storybook also need one Vanilla Extract
compilation path without creating a second styling runtime or a dependency from the package back to the
application.

- `[G-1]` Components expose semantic, accessible intent rather than caller-controlled CSS.
- `[G-2]` Web, the design system, and Storybook compile owner-local Vanilla Extract styles against one shared token contract.
- `[G-3]` Existing form, Lexical, and application dependency boundaries remain intact; shared navigation may depend on `@void/react` without depending on app or feature code.

## 3. Key Design Decisions

| Decision                               | Choice                                                                                                                                  | Rationale                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1]` Shared styling infrastructure | `src/theme/index.ts` exports the public `theme` API; internal `src/theme/tokens.css.ts` owns the Vanilla Extract global token contract. | Consumers share typed theme references without generated infrastructure or a public token module.                              |
| `[KD-2]` Component API                 | Each component uses a local minimal `Pick` of used native props plus its own semantic options.                                          | A component can preserve its accessibility and visual contract without arbitrary styling or root replacement.                  |
| `[KD-3]` Styling ownership             | Recipes are colocated with their visual owner and remain private.                                                                       | Finite presentations are emitted independently of stories and cannot become caller override APIs.                              |
| `[KD-4]` Integration seams             | Overlays pass typed trigger props to a `renderTrigger` callback; DS navigation uses `@void/react` `Link` with `href`.                   | Typed links preserve router navigation while trigger props carry handlers, refs, and ARIA state without shared recipe exports. |
| `[KD-5]` Theme variable names          | `tokens.css.ts` uses Vanilla Extract's `createThemeContract` variable generation.                                                       | Scoped generated names remain an internal implementation detail rather than a custom raw-CSS compatibility API.                |

## 4. Principles & Intents

- `[PI-1]` **One theme API** — `src/theme/index.ts` combines the internal Vanilla Extract variable contract with spacing and exports `theme` from `@recipe-organizer/design-system/theme`. Its camel-case categories and literal token keys produce Vanilla Extract-generated scoped CSS variables; consumers use typed `theme` references and `tokens.css.ts` remains internal.
- `[PI-2]` **Vite compiles local CSS** — web and Storybook load the Vanilla Extract Vite plugin. No scan, code-generation command, or PostCSS extraction step is required; importing an owner-local `*.css.ts` file emits its CSS and importing the public theme module emits global variables.
- `[PI-3]` **Owners choose presentation** — a component owns color, typography, borders, radius, shadow, internal spacing, interaction state, and its finite recipe variants. A feature owns a genuinely feature-specific surface; its parent owns external margins, positioning, grid spans, and sibling gaps.
- `[PI-4]` **Public props express intent** — content, behavior, accessibility, and demonstrated finite presentation or local-layout choices are allowed. Each presentation choice corresponds to actual callers and has a story.
- `[PI-5]` **Native CSS remains an owner tool** — global/reset rules, fonts, theme activation, view transitions, safe-area values, editor-generated-DOM typography, and runtime geometry may use owned native CSS, CSS variables, or DOM updates. Vanilla Extract compilation is not a reason to expose arbitrary values to callers.

## 5. Non-Goals

- `[NG-1]` A generic `Box`/`Flex`, JSX style-prop, or public recipe/styled-factory API.
- `[NG-2]` A consumer API for arbitrary CSS variables, class strings, runtime geometry, or direct DOM styling.
- `[NG-3]` Adopting a headless primitive library, or replacing Void navigation or TanStack Form, Lexical, React Compiler, or app-owned feature dependencies.

## 6. Detailed Design

### 6.1 Infrastructure and compilation boundary

`packages/design-system/src/theme/index.ts` is the sole public theme API, exported as
`@recipe-organizer/design-system/theme`; the former `./tokens` and `./tokens/spacing` public subpaths
are removed. It merges `theme.spacing` with the typed variables from the internal `tokens.css.ts`
contract. Its camel-case categories and literal token keys produce native Vanilla Extract scoped
variables; their generated references and names are internal implementation details. `theme.spacing` is an ordinary function that accepts one to four numbers and returns CSS shorthand values using `calc(4px * n)`, such
as `theme.spacing(1, 2.5)` → `'calc(4px * 1) calc(4px * 2.5)'`. Zero, fractional, and negative
multipliers are supported. It replaces the fixed `sizes` and `spacing` scales; percentages remain
native CSS. `theme.safeArea.top` and `.bottom` wrap the corresponding `env()` inset with a zero fallback.
The token lint rule accepts these values directly and in an additive `calc()` with one `theme.spacing(value)`
call; it does not permit arbitrary CSS expressions. Spacing is not a Vanilla Extract function serializer. Length tokens use
pixels (converted at 16px/rem). `tokens.css.ts` exports `vars` only for `theme/index.ts` and emits the
light `:root` values, `.dark` semantic-color/shadow overrides, and global `skeleton` and `spin` keyframes.
`theme.radius.none` and `theme.shadows.none` provide zero-radius and no-shadow resets. The `inherit`
entries in `theme.radius`, `theme.fontSizes`, and `theme.fontWeights` are literal values added by
`theme/index.ts`: storing CSS-wide `inherit` in a custom property would inherit that variable rather
than the styled property's value.

The color `palette` stays private: neither numbered shades nor black/white primitives are exported or
emitted as CSS variables. The custom `teal` scale retains the existing blue-green brand values.
Dark overrides use palette primitives, with white opacity derived via `color-mix`; the sparse custom
shades preserve existing surface and text colors rather than substituting standard shades.
Generic background/foreground pairs (`info-subtle`, `destructive-subtle`, `neutral-subtle`,
`success-subtle`, and `warning-subtle`) are reusable across components. Ingredient badges map categories
to those roles; spices use the amber `warning-subtle` pair. Color roles never include badge or category names.
`shadow`, `highlight`, `scrim`, and `inverse-foreground` supply fixed depth, lighting, dimming, and
high-contrast text colors without following the light/dark foreground swap.

Web, Storybook, and root Vitest each enable the Vanilla Extract Vite plugin. Web and Storybook
entrypoints import `@recipe-organizer/design-system/global.css` to activate the shared theme, reset, and
base rules. `src/global.css.ts` defines both using `globalStyle` and named layers with typed theme
references. Reset registration precedes base registration, preserving cascade order. Resets cover the elements
actually used by the app and editor; native defaults handle unsupported controls and document elements.
Keep shared box sizing, zero margins/padding, solid border defaults, font/link/form inheritance,
list/media normalization, and keyboard-focus/hidden semantics. Specialized date/search/file-button,
unused element, and browser-default restatements are not maintained.
Base rules own default borders, body colors, font smoothing, and important reduced-motion overrides
(including view transitions). `global.css.ts` also derives the shared `--screen-header-height` from
`theme.safeArea.top` and `theme.spacing(15)`. Native `styles.css` retains only font faces and the full
layer-order declaration. Components and app-owned visual
owners keep styles in owner-local `*.css.ts` modules and use typed `theme` references, including template
interpolations, rather than shared raw `var(--…)` strings. Component and recipe CSS is intentionally
unlayered. Native CSS variables remain appropriate for component-owned and runtime-owned
custom properties. Native global CSS declares `reset`, `base`, `tokens`, `recipes`, and `utilities`
layers, with reset/base rules layered so owner styles override them. No generated styled-system
directory, Panda configuration, or style code-generation command exists.

### 6.2 Component API guidance

Each component declares a local `Pick` of the native props its callers actually use,
plus explicit domain or semantic props. Do not add props for hypothetical callers. This guidance does
not require compile-only prop contracts, shared allowlist helpers, or global `never`-prop blacklists.

Retain variants only when production callers exercise them; Storybook demonstrates supported APIs rather
than preserving unused ones. Inline single-use components into their owners, except icons and required
route styling, hook lifecycle, provider, registry, or lazy-loading boundaries. Count actual call sites,
including internal composition, rather than importing files.

Component styling remains owner-local rather than a public `className`, `style`, or CSS-bag API.
Where composition is needed, an overlay passes its `TriggerProps` (handlers, ARIA state, and ref)
to a `renderTrigger` callback that spreads them onto an existing component such as Button or
`SelectButton`. Button renders the actual `@void/react` Link through `asLink` + `href`.

A component may add a finite named `variant`, `size`, or narrowly proven local-layout control when it
has actual callers and a story. It must not add a `custom`/`unstyled` variant or universal spacing,
grid, responsive-style, color, radius, typography, or arbitrary dimension control. Parent wrappers,
not a child API, own external layout.

### 6.3 Private recipes, primitives, and dynamic geometry

Recipes are implementation details colocated with the component that owns the rendered DOM.
Reuse a component through composition rather than exporting its recipe or duplicating its styles.
Overlay owners (`useDrawer`, `Popover`) own trigger handlers, refs, ARIA/state attributes, and popup
positioning; consumers spread the trigger props rather than recreating that transport.

Icons inherit `currentColor`. An action, navigation item, or other icon owner may set
`--owner-icon-size` on its own DOM; the icon resolves that owner value before its finite standalone
size fallback. Private owner opacity and inline-margin variables preserve action icon treatment
without selecting foreign SVG classes. Consumers choose the icon's documented finite intent, not
SVG class, fill, stroke, geometry, or CSS-variable props.

Image URLs, indices, swipe transforms, popup dimensions, and comparable runtime values remain in
the owning implementation through CSS variables or DOM updates. Native CSS and dynamic geometry are
therefore permitted internally, but no public CSS-variable map is introduced. Editor typography is
scoped to editor-generated DOM and excludes interactive decorators.

### 6.4 Navigation and form integrations

The design system may depend on `@void/react` for actual navigation Links, but never imports app
or feature policy. Button navigates with `asLink` + `href` and optional `viewTransition`, for example
`<Button asLink href="/recipe/new" />`; it renders the actual Void `Link`, not a click-driven button.
TabBar takes `currentPath` and items with `label`, `href`, and inactive/active icons.
`isCurrentPath` matches `/` exactly and other items at their path or descendants; desktop AppHeader
navigation uses the same matcher. Pages pass current path explicitly, so static island layouts do
not require router context. Storybook needs no router decorator.

Tabs are native hash anchors with scroll-snap panels. Once hydrated, clicks scroll the matching
panel and replace the URL hash with `history.replaceState`; tab changes do not push history entries.
Unhydrated static tabs retain native hash behavior.
ScreenLayout accepts a `backButton` slot, usually DS `GoBackButton`, whose default handler calls
`history.back()`; island pages hydrate that control through an island import. Scroll IDs remain
`screen-inner`/`screen-outer`, but there is no managed scroll-container restoration.
DS NotFound provides a Void home Link by default. The regular app layout owns its React render-error
boundary; unknown URLs use Void's default 404.

The app's SearchBar owns the single-use command palette with shared Dialog/ScrollArea and native
ARIA combobox/listbox semantics. Pages/layouts own theme/search composition and recipe/auth policy.
Pages remain unstyled composition of feature sections and app-shell components; they own
cross-feature coordination rather than intermediary page wrappers.

Form dialogs keep a private form-aware composition so body and submit footer share one lifecycle.
Public dialogs do not expose content-render or panel-style props, and forms have no styling escape
hatch. This preserves Enter submission, async disable/cancellation, errors, focus return, and nested
submit-propagation handling. DeleteDialog tracks loading through local state while awaiting
`onDelete`; action callbacks must not be awaited inside a React transition.

### 6.5 Visual role map

Coherence follows semantic roles, not a universal radius or border. Use existing typed tokens:

| Role               | Treatment                                                                                                                                                                                                             | Intentional exceptions                                                                                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary controls  | Buttons (including square icon buttons), inputs, selects, and toggles use `lg` (8px). Neutral outlines use 1px `input`, never a text color.                                                                           | Outline Buttons keep opaque `popover` backing in every state; disabled Buttons retain `0.38` opacity feedback.                                                                                                                                                            |
| Compact controls   | Nested controls, menu/action rows, Button `icon-xs` and `list-action` use `md` (6px).                                                                                                                                 | Tiny badges/menu content retain `sm` (4px); toolbar hosts retain `xl` (12px), compact popovers `lg` (8px).                                                                                                                                                                |
| Containers         | Standard cards, dialogs, and standalone list panels use `2xl` (16px).                                                                                                                                                 | Existing large desktop recipe panels retain `3xl` (24px); embedded recipe sections stay borderless and without their own surface.                                                                                                                                         |
| Capsules and media | `full` communicates a capsule/circle role, not merely equal width and height.                                                                                                                                         | TabBar selection, avatars, switches/handles, circular status illustrations, and semantic pill badges retain it. Recipe media uses the matching borderless `4xl` (32px) squircle silhouette and rounded fallback.                                                          |
| Surfaces           | Page/chrome uses `background` / `foreground`, content uses `card` / `card-foreground`, floating overlays use `popover` / `popover-foreground`.                                                                        | Primary/secondary actions retain their corresponding semantic pairs; recipe-header ghost actions stay transparent.                                                                                                                                                        |
| Navigation         | TabBar uses `background`, inactive `muted-foreground`, and an `accent` / `accent-foreground` selection capsule. Tabs use a `muted` track, `muted-foreground` text, and a moving `card` / `card-foreground` selection. | TabBar keeps its elevation, 64px plus safe-area footprint and mobile-only behavior. Desktop Navbar keeps its primary underline; swipe/indicator geometry remains unchanged.                                                                                               |
| Borders and state  | Structural card/menu borders and separators use 1px `border`; keyboard focus uses 2px `ring`.                                                                                                                         | Keep filled/ghost controls without decorative borders, destructive borders and checkbox/radio state outlines. Preserve translucent state overlays over opaque backing, disabled feedback, and border-compensated padding. Inset shapes reuse their parent's radius token. |

Shared shadow roles stay minimal: `shadows.ring` supplies the 1px translucent focus ring, while
`.ringInvalid` supplies its invalid counterpart and `.invalid` retains the solid 3px invalid ring;
`.edge` supplies the subtle light/dark surface edge. Components reuse these roles rather than
creating opacity variants, and retain the existing elevation scale. Unmatched fixed font sizes and
radii use the nearest existing token, rounding equal-distance choices upward.

Ingredient-category badges use `Badge`'s semantic `*-subtle` variants; category-to-variant mapping stays
in the ingredient feature. Shopping rows use `Toggle`'s `check-row` presentation, which owns the pressed
indicator and text treatment; the feature retains per-row checked state and quantity content.

State overlays and image clipping follow the owner's shape. Global reset supplies solid border style;
do not redeclare it solely because an owner specifies only border width. Required text contrast is
4.5:1 and non-text indicators/focus 3:1 against resolved backgrounds. Correct an insufficient shared
role at the token owner and review its consumers rather than introducing local color mixes.

## 7. Compatibility and Review Criteria

Existing dependency direction remains: the design system does not import web, app, feature, or
router-policy code, while its reusable navigation may use `@void/react` Links. Feature schemas, queries,
mutations, domain presentation, menus/filtering, and recipe/auth policy stay app-owned. Use actual
Links for navigation; do not substitute click-driven buttons.

When changing a reusable component, review all named/compound exports and forwarding paths, actual
callers, and typed spreads. Add or update a colocated story for every supported presentation. Verify
that no caller selector reaches into another component's owned DOM and that a feature-specific visual
uses feature-owned DOM rather than a shared-component override.

## Changelog

| Date       | Amendment                                                                                            | Sections affected | Reason                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| 2026-09-17 | Add the semantic shape, surface, border, and contrast role map.                                      | §6.5              | Keep shared controls coherent while recording intentional navigation/media exceptions.   |
| 2026-09-17 | Replace Panda generation with Vanilla Extract.                                                       | §2–§6.1           | Remove generated styling infrastructure.                                                 |
| 2026-09-17 | Replace size/spacing scales with `theme.spacing`.                                                    | §6.1              | Support numeric CSS shorthand without enumerated tokens.                                 |
| 2026-09-17 | Publish the combined `theme` API and remove public token subpaths.                                   | §3, §4, §6.1      | Give `.css.ts` consumers one typed import while keeping token internals private.         |
| 2026-09-17 | Keep the palette private; expose semantic badge and contrast colors.                                 | §6.1              | Preserve appearance without exposing primitive color scales.                             |
| 2026-09-17 | Generalize subtle color roles and source all dark overrides from primitives.                         | §6.1              | Remove badge-specific naming and reuse the private palette without visual changes.       |
| 2026-09-17 | Move shared reset and base rules into global Vanilla Extract styles.                                 | §6.1              | Use typed theme references while preserving cascade and reduced-motion behavior.         |
| 2026-09-17 | Consolidate reset/base rules in `src/global.css.ts`.                                                 | §6.1              | Keep shared global styles in one module and public entrypoint.                           |
| 2026-09-17 | Use native Vanilla Extract generation for shared theme variables.                                    | §3, §4, §6.1      | Keep generated raw variable names internal to the typed theme contract.                  |
| 2026-09-18 | Add safe-area/reset tokens, consolidate shadows, normalize unmatched sizes, and prune unused resets. | §6.1, §6.5        | Enforce a minimal token vocabulary while preserving native semantics and focus contrast. |
| 2026-09-18 | Allow typed TanStack Router navigation in reusable DS components.                                    | §3, §6.4, §7      | Move router-only navigation/layout/error components into DS without moving app policy.   |
| 2026-09-18 | Keep route presentation in feature sections and the app shell.                                       | §6.4              | Routes compose styled components rather than owning styles.                              |
| 2026-09-18 | Consolidate focus shadows on `shadows.ring`.                                                         | §6.5              | Remove the redundant focus token and use the same ring across controls.                  |
| 2026-09-19 | Add the warning-subtle color pair for spice badges.                                                  | §6.1              | Give spices a readable amber category treatment.                                         |
| 2026-09-19 | Retain production-backed APIs and inline single-use navigation, errors, and command UI.              | §6.2, §6.4        | Reduce ownership without breaking framework or route-styling boundaries.                 |
| 2026-09-19 | Share subtle badges and check-row toggles instead of feature-local controls.                         | §6.5              | Keep semantic styling and accessible control state in the design system.                 |
| 2026-09-28 | Remove Base UI; compose overlays through `renderTrigger` and native elements.                        | §2–§6.4           | Own every primitive natively and drop the dependency.                                    |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries.               | Updated contracts | Reflect the completed page migration.                                                    |

## 8. Open Questions

None.

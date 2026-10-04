---
title: Design-System Styling and Ownership
status: amended
author: Antoine Bouteiller
date: 2026-09-16
related:
  [
    AGENTS.md,
    src/styles/theme/tokens.css,
    src/styles/global.css,
    docs/file-structure.spec.md,
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/client/routing-ssr.spec.md,
  ]
---

## 2. Problem Statement

Reusable UI must retain its visual and structural ownership while web features retain their own
layout and domain presentation. Components, the app, and Storybook share native semantic tokens
without a styling runtime or a dependency from the design system back to the application.

- `[G-1]` Components expose semantic, accessible intent rather than caller-controlled CSS.
- `[G-2]` Web, the design system, and Storybook use owner-local scoped CSS against one shared semantic token contract.
- `[G-3]` Existing form, Lexical, and application dependency boundaries remain intact; shared navigation may depend on `@void/svelte` without depending on app or feature code.

## 3. Key Design Decisions

| Decision                                 | Choice                                                                                                                        | Rationale                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1.1]` Shared styling infrastructure | `src/styles/theme/tokens.css` owns semantic custom properties; `src/styles/global.css` activates tokens and reset/base rules. | Native CSS needs no JavaScript theme facade or styling plugin.                                                                 |
| `[KD-2]` Component API                   | Each component uses a local minimal `Pick` of used native props plus its own semantic options.                                | A component can preserve its accessibility and visual contract without arbitrary styling or root replacement.                  |
| `[KD-3.1]` Styling ownership             | Scoped `<style>` blocks stay with their DOM owner; finite props use explicit literal unions and local selectors.              | Presentation remains private rather than a caller override API.                                                                |
| `[KD-4]` Integration seams               | Overlays pass typed trigger props to a `renderTrigger` snippet; DS navigation uses `@void/svelte` `Link` with `href`.         | Typed links preserve router navigation while trigger props carry handlers, refs, and ARIA state without shared recipe exports. |
| `[KD-5.1]` Theme variable names          | `tokens.css` declares `--<category>-<token>` names in kebab-case.                                                             | One semantic vocabulary is shared by native component and global CSS.                                                          |

Superseded: ~~`[KD-1]` JavaScript theme infrastructure~~, ~~`[KD-3]` private Vanilla Extract recipes~~, and ~~`[KD-5]` generated variable names~~.

## 4. Principles & Intents

- ~~`[PI-1]` One JavaScript theme API~~. `[PI-1.1]` **One semantic vocabulary** — consume `var(--<category>-<token>)` from `src/styles/theme/tokens.css`; no JavaScript theme API or primitive palette variables exist.
- ~~`[PI-2]` Vanilla Extract compiles local CSS~~. `[PI-2.1]` **Owners use scoped CSS** — Svelte components, stories, and existing example hosts keep presentation in native `<style>` blocks. No styling plugin, preprocessor, utility generator, or replacement framework is used.
- `[PI-3]` **Owners choose presentation** — a component owns color, typography, borders, radius, shadow, internal spacing, interaction state, and its finite presentation variants. A feature owns a genuinely feature-specific surface; its parent owns external margins, positioning, grid spans, and sibling gaps.
- `[PI-4]` **Public props express intent** — content, behavior, accessibility, and demonstrated finite presentation or local-layout choices are allowed. Each presentation choice corresponds to actual callers and has a story.
- `[PI-5]` **Native CSS remains an owner tool** — global/reset rules, fonts, theme activation, view transitions, safe-area values, editor-generated-DOM typography, and runtime geometry may use owned native CSS, CSS variables, or DOM updates. Internal styling is not a reason to expose arbitrary values to callers.

## 5. Non-Goals

- `[NG-1]` A generic `Box`/`Flex`, inline style-prop, or public recipe/styled-factory API.
- `[NG-2]` A consumer API for arbitrary CSS variables, class strings, runtime geometry, or direct DOM styling.
- `[NG-3]` Adopting a headless primitive library, or replacing Void navigation, Lexical, or app-owned feature dependencies.

## 6. Detailed Design

### 6.1 Infrastructure and compilation boundary

```text
pages/layout.svelte + .storybook/preview.ts
  -> @/styles/global.css -> ./theme/tokens.css
  -> @/styles/styles.css
component / story / example.svelte -> scoped, unlayered <style>
```

`tokens.css` owns `:root` semantic values, `.dark` overrides, and global `skeleton`/`spin`
keyframes. Category and token names use kebab-case: `--colors-primary`, `--font-sizes-sm`,
`--radius-2xl`, `--shadows-ring-invalid`, and `--safe-area-bottom`. `.dark` is applied to the
root document so portaled content inherits the same tokens.

Spacing uses direct lengths at a 4px base, including fractional and negative values, or native
`calc()` for arithmetic: `11px`, `4px 10px`, and `-4px`. There is no enumerated spacing scale.
Length tokens stay in pixels; CSS-wide keywords such as `inherit` stay literal, not custom
property values. Media-query thresholds stay literal because custom properties cannot substitute
inside media conditions. Safe-area properties wrap `env(safe-area-inset-top/bottom, 0px)`.

Primitive palette scales are not exported. Semantic subtle background/foreground pairs are shared
across components; ingredient category mapping stays feature-owned, with spices using the warning
pair. Fixed `shadow`, `highlight`, `scrim`, and `inverse-foreground` roles do not follow the
light/dark foreground swap. Preserve color mixes and dark shadow overrides at the token owner.

`global.css` declares layer order before layered reset/base rules and imports tokens. It owns
box sizing, zero margins/padding, solid border defaults, inheritance, list/media normalization,
focus/hidden semantics, body defaults, document sizing and scroll locking, header safe-area height,
global view-transition keyframes, and important reduced-motion overrides. `styles.css` retains
font faces, layer order, and cross-document view-transition activation. Owner rules are unlayered.

Native semantic token use is a documented review contract; no token lint rule or CSS lint framework
is configured. The shared CSS build chunk must include native and Svelte virtual CSS so initial SSR
and client navigation both receive owner styles.

### 6.2 Component API guidance

Each component declares a local `Pick` of the native props its callers actually use,
plus explicit domain or semantic props. Do not add props for hypothetical callers. This guidance does
not require compile-only prop contracts, shared allowlist helpers, or global `never`-prop blacklists.

Retain variants only when production callers exercise them; Storybook demonstrates supported APIs rather
than preserving unused ones. Inline single-use components into their owners, except icons and required
route styling, hook lifecycle, provider, registry, or lazy-loading boundaries. Count actual call sites,
including internal composition, rather than importing files.

Component styling remains owner-local rather than a public `class`, `style`, or CSS-bag API.
Where composition is needed, an overlay passes its `TriggerProps` (handlers, ARIA state, and ref)
to a `renderTrigger` snippet that spreads them onto an existing component such as Button or
`SelectButton`. Button renders the actual `@void/svelte` Link through `asLink` + `href`.

A component may add a finite named `variant`, `size`, or narrowly proven local-layout control when it
has actual callers and a story. It must not add a `custom`/`unstyled` variant or universal spacing,
grid, responsive-style, color, radius, typography, or arbitrary dimension control. Parent wrappers,
not a child API, own external layout.

### 6.3 Scoped presentation and dynamic geometry

Local classes and presentation data attributes remain private. Explicit TypeScript literal unions
retain supported options and defaults; combining selectors preserves compound states and precedence.
Reuse components through composition, not exported style helpers. Bounded duplication of input
surfaces and drawer pieces remains in their existing DOM owners rather than new global utilities.
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

Scoped selectors target owned DOM. Use narrowly named, anchored `:global()` only for child roots,
rendered snippets, generated content, and global property/animation names; do not globalize blocks
merely to suppress warnings. Button's forwarded Void Link class uses an owner-specific global
selector because the anchor is compiled by the adapter. `.dark` ancestors are global while their
local owner remains scoped. Snippet content belongs to its declaring component, and portaled DOM
retains its scope classes but cannot depend on an ancestor left behind. Select owns its placeholder;
its shared trigger owns the text container and icon. Story CSF content must receive effective scoped
styles; use existing example hosts where required.

Tabs retains its registered integer `--tabs-count`, sibling calculation, timeline scope, scroll snap,
and scroll-driven clipping. Geometry stays in existing hooks/DOM updates, not replacement JavaScript.

### 6.4 Navigation and form integrations

The design system may depend on `@void/svelte` for actual navigation Links, but never imports app
or feature policy. Button navigates with `asLink` + `href` and optional `viewTransition`, for example
`<Button asLink href="/recipe/new" />`; it renders the actual Void `Link`, not a click-driven button.
TabBar takes `currentPath` and items with `label`, `href`, and inactive/active icons.
`isCurrentPath` matches `/` exactly and other items at their path or descendants; desktop AppHeader
navigation uses the same matcher. Pages pass current path explicitly. Storybook needs no router decorator.

Tabs are native hash anchors with scroll-snap panels. Once hydrated, clicks scroll the matching
panel and replace the URL hash with `history.replaceState`; tab changes do not push history entries.
Unhydrated static tabs retain native hash behavior.
ScreenLayout accepts a `backButton` slot, usually DS `GoBackButton`, whose default handler calls
`history.back()`. Scroll IDs remain
`screen-inner`/`screen-outer`, but there is no managed scroll-container restoration.
DS NotFound provides a Void home Link by default. The root layout owns pathname-keyed `<svelte:boundary>` render-error
boundaries; unknown URLs use Void's default 404.

The app's SearchBar owns the single-use command palette with shared Dialog/ScrollArea and native
ARIA combobox/listbox semantics. Pages/layouts own theme/search composition and recipe/auth policy.
Pages remain unstyled composition of feature sections and app-shell components; they own
cross-feature coordination rather than intermediary page wrappers.

Form dialogs keep a private form-aware composition so body and submit footer share one lifecycle.
Public dialogs do not expose content-render or panel-style props, and forms have no styling escape
hatch. This preserves Enter submission, async disable/cancellation, errors, focus return, and nested
submit-propagation handling. DeleteDialog tracks loading through local state while awaiting
`onDelete`; callers own the awaited action.

### 6.5 Visual role map

Coherence follows semantic roles, not a universal radius or border. Use existing semantic tokens:

| Role               | Treatment                                                                                                                                                                                                             | Intentional exceptions                                                                                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary controls  | Buttons (including square icon buttons), inputs, selects, and toggles use `lg` (8px). Neutral outlines use 1px `input`, never a text color.                                                                           | Outline Buttons keep opaque `popover` backing in every state; disabled Buttons retain `0.38` opacity feedback.                                                                                                                                                            |
| Compact controls   | Nested controls, menu/action rows, Button `icon-xs` and `list-action` use `md` (6px).                                                                                                                                 | Tiny badges/menu content retain `sm` (4px); toolbar hosts retain `xl` (12px), compact popovers `lg` (8px).                                                                                                                                                                |
| Containers         | Standard cards, dialogs, and standalone list panels use `2xl` (16px).                                                                                                                                                 | Existing large desktop recipe panels retain `3xl` (24px); embedded recipe sections stay borderless and without their own surface.                                                                                                                                         |
| Capsules and media | `full` communicates a capsule/circle role, not merely equal width and height.                                                                                                                                         | TabBar selection, avatars, switches/handles, circular status illustrations, and semantic pill badges retain it. Recipe media uses the matching borderless `4xl` (32px) squircle silhouette and rounded fallback.                                                          |
| Surfaces           | Page/chrome uses `background` / `foreground`, content uses `card` / `card-foreground`, floating overlays use `popover` / `popover-foreground`.                                                                        | Primary/secondary actions retain their corresponding semantic pairs; recipe-header ghost actions stay transparent.                                                                                                                                                        |
| Navigation         | TabBar uses `background`, inactive `muted-foreground`, and an `accent` / `accent-foreground` selection capsule. Tabs use a `muted` track, `muted-foreground` text, and a moving `card` / `card-foreground` selection. | TabBar keeps its elevation, 64px plus safe-area footprint and mobile-only behavior. Desktop Navbar keeps its primary underline; swipe/indicator geometry remains unchanged.                                                                                               |
| Borders and state  | Structural card/menu borders and separators use 1px `border`; keyboard focus uses 2px `ring`.                                                                                                                         | Keep filled/ghost controls without decorative borders, destructive borders and checkbox/radio state outlines. Preserve translucent state overlays over opaque backing, disabled feedback, and border-compensated padding. Inset shapes reuse their parent's radius token. |

Shared shadow roles stay minimal: `--shadows-ring` supplies the 1px translucent focus ring, while
`--shadows-ring-invalid` supplies its invalid counterpart and `--shadows-invalid` retains the solid 3px invalid ring;
`--shadows-edge` supplies the subtle light/dark surface edge. Components reuse these roles rather than
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
router-policy code, while its reusable navigation may use `@void/svelte` Links. Feature schemas, queries,
mutations, domain presentation, menus/filtering, and recipe/auth policy stay app-owned. Use actual
Links for navigation; do not substitute click-driven buttons.

When changing a reusable component, review all named/compound exports and forwarding paths, actual
callers, and typed spreads. Add or update a colocated story for every supported presentation. Verify
that no caller selector reaches into another component's owned DOM and that a feature-specific visual
uses feature-owned DOM rather than a shared-component override.

## Changelog

| Date       | Amendment                                                                                            | Sections affected  | Reason                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| 2026-09-17 | Add the semantic shape, surface, border, and contrast role map.                                      | §6.5               | Keep shared controls coherent while recording intentional navigation/media exceptions.   |
| 2026-09-17 | Replace Panda generation with Vanilla Extract.                                                       | §2–§6.1            | Remove generated styling infrastructure.                                                 |
| 2026-09-17 | Replace size/spacing scales with `theme.spacing`.                                                    | §6.1               | Support numeric CSS shorthand without enumerated tokens.                                 |
| 2026-09-17 | Publish the combined `theme` API and remove public token subpaths.                                   | §3, §4, §6.1       | Give `.css.ts` consumers one typed import while keeping token internals private.         |
| 2026-09-17 | Keep the palette private; expose semantic badge and contrast colors.                                 | §6.1               | Preserve appearance without exposing primitive color scales.                             |
| 2026-09-17 | Generalize subtle color roles and source all dark overrides from primitives.                         | §6.1               | Remove badge-specific naming and reuse the private palette without visual changes.       |
| 2026-09-17 | Move shared reset and base rules into global Vanilla Extract styles.                                 | §6.1               | Use typed theme references while preserving cascade and reduced-motion behavior.         |
| 2026-09-17 | Consolidate reset/base rules in `src/design-system/global.css.ts`.                                   | §6.1               | Keep shared global styles in one module and public entrypoint.                           |
| 2026-09-17 | Use native Vanilla Extract generation for shared theme variables.                                    | §3, §4, §6.1       | Keep generated raw variable names internal to the typed theme contract.                  |
| 2026-09-18 | Add safe-area/reset tokens, consolidate shadows, normalize unmatched sizes, and prune unused resets. | §6.1, §6.5         | Enforce a minimal token vocabulary while preserving native semantics and focus contrast. |
| 2026-09-18 | Allow typed TanStack Router navigation in reusable DS components.                                    | §3, §6.4, §7       | Move router-only navigation/layout/error components into DS without moving app policy.   |
| 2026-09-18 | Keep route presentation in feature sections and the app shell.                                       | §6.4               | Routes compose styled components rather than owning styles.                              |
| 2026-09-18 | Consolidate focus shadows on `--shadows-ring`.                                                       | §6.5               | Remove the redundant focus token and use the same ring across controls.                  |
| 2026-09-19 | Add the warning-subtle color pair for spice badges.                                                  | §6.1               | Give spices a readable amber category treatment.                                         |
| 2026-09-19 | Retain production-backed APIs and inline single-use navigation, errors, and command UI.              | §6.2, §6.4         | Reduce ownership without breaking framework or route-styling boundaries.                 |
| 2026-09-19 | Share subtle badges and check-row toggles instead of feature-local controls.                         | §6.5               | Keep semantic styling and accessible control state in the design system.                 |
| 2026-09-28 | Remove Base UI; compose overlays through `renderTrigger` and native elements.                        | §2–§6.4            | Own every primitive natively and drop the dependency.                                    |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries.               | Updated contracts  | Reflect the completed page migration.                                                    |
| 2026-10-03 | Document direct back-button composition and both layout error boundaries.                            | §6.4               | Match hydrated route composition.                                                        |
| 2026-10-04 | Move DS composition to Svelte: `renderTrigger` snippets, `@void/svelte` Link, `<svelte:boundary>`.   | §3, §6.2, §6.4, §7 | Match the shipped Svelte conventions.                                                    |

## 8. Open Questions

None.

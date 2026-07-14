# §01 — Tooling & Build

Goal: `vp dev` compiles Solid JSX and boots. No app code migrated yet — just the toolchain.

## package.json

Remove:

```
react react-dom @types/react @types/react-dom
@vitejs/plugin-react babel-plugin-react-compiler @rolldown/plugin-babel
@tanstack/react-* (all)
@base-ui/react @phosphor-icons/react @lexical/react
better-auth/react is not a package — it's a subpath; keep better-auth
```

Add:

Exact-pin every version (no carets — repo convention + no compiler safety net). Versions below are
the last stable at plan time; re-confirm with `npm view <pkg> version` at install and pin whatever is
current, then upgrade in lockstep.

```
solid-js@1.9.14
vite-plugin-solid@2.11.12                 (dev)
@tanstack/solid-router@1.170.18 @tanstack/solid-start@1.168.28 @tanstack/solid-router-ssr-query@1.167.1
@tanstack/solid-query@5.101.2 @tanstack/solid-query-devtools@5.101.2
@tanstack/solid-form@1.33.2 @tanstack/solid-store@0.11.0
@tanstack/solid-router-devtools @tanstack/solid-devtools   (dev, optional)
@kobalte/core@0.13.12
@corvu/drawer@0.2.4
phosphor-solid@1.1.5        (committed — same Phosphor set as the React pkg, glyph parity guaranteed)
@solid-primitives/media     (for useIsMobile, replaces the current media hook)
```

**Icon suffix rename:** phosphor-solid exports **bare names** (`ArrowLeft`), while the React pkg uses
the `Icon` suffix (`ArrowLeftIcon`). Strip `Icon` from all ~48 icon imports and usages during the
component ports (§04 / feature migration). No `lucide-solid` — food glyphs (`Carrot`, `Pepper`,
`Cow`, `CookingPot`, `Fish`) exist in phosphor-solid and would be lost switching sets.

Editor deps: **remove `@lexical/react` only**; **keep** `lexical`, `@lexical/list`,
`@lexical/rich-text`, `@lexical/utils` — the custom Solid binding (§08) builds on those core
packages. The editor field is stubbed (§06) until the §08 binding lands.

## vite config

Swap the plugin. Solid's plugin must run before the Cloudflare/TanStack plugins as usual.

```ts
// vite.config.ts
import solid from 'vite-plugin-solid'
// remove: import react from '@vitejs/plugin-react'
// remove the babel/react-compiler plugin block entirely

export default defineConfig({
  plugins: [
    solid({ ssr: true }), // SSR on; TanStack Start drives entry points
    // ...cloudflare(), tanstackStart(), tailwind(), serwist() unchanged
  ],
})
```

The TanStack Start Vite plugin has a framework option/entry — point it at the Solid adapter
(`@tanstack/solid-start/plugin` or the framework field, per the installed version's docs). Verify
against `node_modules/@tanstack/solid-start` README; the plugin name is the only moving part.

## tsconfig

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve", // was react-jsx
    "jsxImportSource": "solid-js",
    "types": ["vite/client", "@cloudflare/workers-types"], // drop react types
  },
}
```

`jsx: "preserve"` + `jsxImportSource: solid-js` lets `vite-plugin-solid` (babel) do the transform.
Do **not** use `react-jsx`.

## Lint / format (Oxlint / Oxfmt via vp)

- Drop the React and react-hooks Oxlint plugins from the config; they'll flag valid Solid code
  (e.g. "conditional hook" false positives on `Show`/`createEffect`).
- Add `eslint-plugin-solid` equivalents only if Oxlint supports a Solid ruleset; if not, rely on
  TypeScript + the §03 review checklist. Oxlint has no Solid plugin today — **do not block on it**,
  just remove the React rules so `vp lint` stops erroring.
- Oxfmt is framework-agnostic; no change.

## knip

`knip.json` (if present) references React entry points implicitly. Re-run `knip` after §02 lands
new entries; update `entry`/`project` globs if the router entry file names change.

## Validation for this step

- `vp install` clean.
- A throwaway `src/routes/__root.tsx` returning `<html><body>hi</body></html>` renders via
  `pnpm dev`. (Real root comes in §02.)
- `vp check` passes with zero React-typed files remaining in the graph (they'll be migrated in
  later steps, so scope this check to the files touched here).

## ponytail notes

- Skip any Solid ESLint tooling until it demonstrably catches a real bug — TS + review covers it.
  Add when a reactivity regression slips to prod.
- Don't add `@solid-primitives/*` beyond `media`; the rest of the primitives grab-bag is YAGNI.

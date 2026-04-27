# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Few Clicks

A no-code website builder. Users pick a template from a gallery (currently portfolios under `src/templates/portfolios/<template-name>/`), edit its content through a visual builder — no code edits — and export the resulting project. Templates are open-source designs (e.g. `magicui`) that would otherwise require a developer to clone and hand-edit.

## Commands

Package manager is Bun (see `bun.lock`).

- `bun dev` — Next.js dev server
- `bun run build` — production build
- `bun run start` — serve the production build
- `bun run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is no test runner configured.

## Architecture

### Next.js 16 + React 19 + React Compiler

- `next.config.ts` enables `reactCompiler: true` (babel-plugin-react-compiler). **Do not manually memoize** with `useMemo`/`useCallback`/`React.memo` unless the compiler fails on a specific component — the compiler handles it.
- Next.js 16 has breaking changes from earlier majors; consult `node_modules/next/dist/docs/` before relying on any API you remember from training data.
- Path alias: `@/*` → `src/*`.

### App shell vs. templates (important distinction)

The repo holds two separate things under `src/`:

1. **The builder app itself** — `src/app/`, `src/components/` (with `ui/` for shadcn primitives and `pages/` for builder pages), `src/providers/`, `src/stores/`, `src/lib/`. This is the Next.js app users interact with.
2. **Template source trees** — `src/templates/portfolios/<name>/` (e.g. `magicui/`). Each template is a **self-contained mini-Next-app** with its own `app/`, `components/`, `data/`, `lib/`. Templates use relative imports (`../data/data`, `../components/...`) — **not** the `@/` alias — because they must be exportable as standalone projects. Preserve that convention when adding or modifying templates.

### Template data contract

Every portfolio template is data-driven via a Zod schema pattern:

- `<template>/data/schema.ts` defines the `Data` schema and exported `Data` type.
- `<template>/data/data.tsx` exports a `DATA` constant typed `as const satisfies Data`.
- Components read from `DATA` and render.

**`data.tsx` must stay pure JSON** — no component references, no JSX, no non-serializable values. The exporter serializes the live store state back into a `data.tsx` source file on export (Phase 3), and anything that "looks like code" inside the data breaks that pipeline.

The convention for "references to code" (icons today; could be variant names, animation presets, layout keys tomorrow) is a **string-key + lookup** pattern:

- `schema.ts` defines a `z.enum([...])` and exports its inferred type (e.g. `IconKey`).
- `data.tsx` stores the key as a plain string (e.g. `icon: "github"`).
- Components resolve the key at render time via a map (e.g. `Icons[key]`, where `Icons` lives in `<template>/components/icons.tsx`).

Apply the same discipline to any future editable field that would otherwise need a component or JSX value. The template author's job is to make those keys resolve to components/behavior; the data's job is only to *name* them.

### State management (zustand)

Uses the **vanilla store + React Context provider** pattern (not the bare `create()` hook), so each store instance is scoped to a provider rather than being a module-level singleton. See `src/stores/counter-store.ts` and `src/providers/counter-store-provider.tsx` for the canonical shape:

- `createXStore(initState)` returns a `createStore()` from `zustand/vanilla`.
- A `XStoreProvider` constructs the store once via `useState(() => createXStore())` and supplies it through Context.
- A `useXStore(selector)` hook reads from the context's store via `useStore(ctx, selector)`.

The counter store/provider is a scaffold — when building real features, follow the same pattern rather than falling back to module-level `create()`.

The provider is mounted in `src/app/layout.tsx`, so any store added must also be wired in there (or nested appropriately).

### Builder ↔ template bridge

The builder lets the user edit a template's data and see a live preview, then exports a standalone project. The bridge between those two worlds has three moving parts:

1. **Live edit** — a per-template zustand store (seeded with the template's static `DATA`) holds the current editable value. Sidebar edits mutate the store.
2. **Preview** — the template renders inside the builder wrapped in a `TemplateDataProvider` whose value comes from the store. Template components read their data through a `useData()` hook that prefers the provider's value and falls back to the imported `DATA` constant.
3. **Export** — the exporter reads the current store value, serializes it into a fresh `data.tsx` source file, copies the template tree, overwrites `data.tsx`, and bundles the result. The exported project has no store, no provider, no builder dependency.

Invariants this architecture enforces:

- **Templates stay standalone.** `useData()` lives inside each template and falls back to `DATA` when no provider is mounted. An exported project runs with zero builder code.
- **Client vs. server boundary.** `useData()` is a React context hook — usable only in client components. **Server components and metadata functions** (`generateMetadata`, `opengraph-image.tsx`, etc.) must `import { DATA }` directly; that's fine because they run at build time and freeze the data into the output anyway. During live preview the builder renders the template as an all-client subtree so every edit propagates.
- **One source of truth per role.** Store = live editable values. `DATA.ts` = the frozen snapshot that ships with the exported project. Template code = components and behavior. Icons, variants, and anything resembling a "code reference" live in code under a string-key lookup, never in data.

## Implementation roadmap

### Phase 1 — Serializable data layer ✅ DONE

Goal: make `data.tsx` pure JSON so it can be serialized back on export.

Completed for the `magicui` template:

- `components/icons.tsx` exports an `Icons` map keyed by short strings (`home`, `globe`, `email`, `linkedin`, `x`, `youtube`, `github`). `home` was added to cover the navbar case that previously used a direct `lucide-react` component reference.
- `data/schema.ts` defines `IconKeySchema = z.enum([...])` and exports `IconKey`. Every `icon:` field in the schema (navbar items, social entries, project links, hackathon links) refers to this enum.
- `data/data.tsx` stores icons as string keys only — no `Icons.xxx`, no `<Icons.xxx className="..." />`, no `lucide-react`/`Icons` imports. The file is pure JSON-shaped.
- Icon-consuming components resolve keys at render time:
  - `components/navbar.tsx` — `const ItemIcon = Icons[item.icon]`, `const IconComponent = Icons[social.icon]`.
  - `components/section/hackathons-section.tsx` — `const LinkIcon = Icons[link.icon]; <LinkIcon className="h-4 w-4" />`.
  - `components/project-card.tsx` — `links[].icon` prop typed as `IconKey`; renders `<LinkIcon className="size-3" />`.

Verified clean with `bun run lint` (no new issues) and `bunx tsc --noEmit` (zero errors).

When adding a new template, follow this discipline from day one — never put components or JSX into the editable data.

### Phase 2 — Store indirection & preview wiring ✅ DONE

Goal: make the template render against the builder's zustand store during preview, without breaking its standalone-ability.

Completed:

1. **`magicui/data/use-data.ts`** — defines `TemplateDataContext = createContext<Data | null>(null)`, exports `TemplateDataProvider` (the context's `Provider`), and exports `useData()` implemented as `useContext(TemplateDataContext) ?? DATA`. The file is `"use client"` and lives inside the template tree — when an exported standalone project mounts no provider, the hook transparently falls back to the static `DATA`.
2. **Client components migrated to `useData()`**:
   - `components/navbar.tsx`
   - `components/section/contact-section.tsx`
   - `components/section/projects-section.tsx`
   - `components/section/hackathons-section.tsx`
   - `components/section/work-section.tsx`
   - `app/page.tsx` — now `"use client"` and reads via `useData()`. (The page renders top-level fields like `name`, `description`, `skills`, `education` directly, so leaving it on a static `DATA` import would have made those fields unresponsive in the preview. The page tree was already mostly client-rendered (BlurFade, animations), so adding the directive costs little.)
3. **RSC / build-time files kept on direct `DATA` import**:
   - `app/layout.tsx` — only its `metadata` export reads `DATA`. The `RootLayout` body renders `<Navbar />` and `{children}`, both of which now flow through `useData()`. Metadata is build-time and freezes into the output regardless of the live store.
   - `app/opengraph-image.tsx` — edge runtime, no React tree, no hooks possible.
4. **Builder store + provider** — `src/stores/magicui-store.ts` and `src/providers/magicui-store-provider.tsx`, following the counter-store scaffold exactly. State `{ data: Data }`; actions `setData(data)` and `patch<K>(key, value)`. Seeded from the template's static `DATA` as `defaultInitState`. The provider is **not** globally mounted — it's mounted per builder route, since different templates will have different store shapes.
5. **Preview route at `src/app/builder/magicui/page.tsx`** — mounts `<MagicuiStoreProvider>` → a `Preview` client component that reads `data` from the store and wraps the rendered template in `<TemplateDataProvider value={data}>`. The shell composes the template's `<ThemeProvider>` + `<TooltipProvider>` + the imported `MagicuiPage` + `<Navbar />`, all inside a wrapper div that applies `geist.variable` and `geistMono.variable` so the template's font-sans / font-mono classes resolve correctly. The builder explicitly does **not** reuse the template's `layout.tsx` (which has its own `<html>`/`<body>` shell, metadata exports, and global-CSS import that don't fit inside the builder's outer layout). A small `DebugPanel` with a "Mutate name" button proves the data flow loop end-to-end; that panel will be replaced by the real sidebar editor in a later phase.
6. **Shared template-side assets** — fonts were extracted from `app/layout.tsx` into `lib/fonts.ts` (`geist`, `geistMono` from `next/font/google`). Both the standalone template's `layout.tsx` and the builder's preview route import from there. When a template needs assets that the builder also has to apply (fonts, theme tokens, future shared shells), put them under the template's `lib/` so they ship with the export and stay the single source of truth.

Verified clean with `bun run lint` (no new issues; the same 5 pre-existing ones remain) and `bunx tsc --noEmit` (zero errors).

Note on the standalone template: rendering the template's `app/` directly outside the builder still works — `useData()` returns the static `DATA` when no `TemplateDataProvider` is mounted, so no builder code is required.

### Phase 3 — Exporter ⏳ PENDING

Goal: turn the current store state into a runnable standalone Next.js project.

Work items:

1. **TS-literal serializer** — pure function `serializeData(data: Data): string` that pretty-prints a JS object literal from pure JSON. Requirements:
   - Nested objects and arrays with consistent indentation.
   - String keys quoted only when they contain non-identifier characters.
   - Trailing `as const satisfies Data`.
   - Header: `import type { Data } from "./schema";\n\nexport const DATA = ...`.
   - Because Phase 1 guarantees `Data` contains no functions/JSX, this is a straightforward recursive printer — no TypeScript AST library required. (If a future schema introduces `Date`, `bigint`, etc., extend the printer.)
2. **Template tree copy** — recursively copy `src/templates/portfolios/<name>/` into an output directory. If builder-only files are introduced later, exclude them here (none exist as of Phase 1). Preserve relative imports (already the template convention).
3. **Overwrite `data/data.tsx`** in the output directory with the serializer's output.
4. **Bundle & deliver** — zip the output directory. Client-side export can use a JS zip library in the browser; server-side export can stream a zip response. Choice depends on where the exporter runs (route handler vs. client-only bundle).

Acceptance criteria:
- User downloads the zip, unpacks it, runs `bun install && bun dev`, and sees their edited template running.
- The unpacked project has no reference to the builder, no zustand store, no `TemplateDataProvider` wrapping — just the template tree with `data.tsx` rewritten.
- `data.tsx` in the export validates against `schema.ts` (i.e. `DataSchema.safeParse(DATA).success === true`).

### Styling: Tailwind v4 + shadcn (radix-nova style)

- Tailwind v4 is configured **entirely through CSS** — there is no `tailwind.config.*`. See `src/app/globals.css` for `@theme inline`, CSS variables, and the light/dark design tokens (OKLCH).
- `components.json` pins shadcn to `style: "radix-nova"`, `baseColor: "neutral"`, `iconLibrary: "lucide"`, `rsc: true`. When running `shadcn` to add components, these defaults apply.
- `cn()` helper lives at `src/lib/utils.ts` (`clsx` + `tailwind-merge`).
- Dark mode is class-based via `next-themes` (see templates' `theme-provider.tsx`) with the `@custom-variant dark (&:is(.dark *));` rule in `globals.css`.

### Key dependencies

`motion` (Framer Motion successor) for animations, `react-markdown` for rendering markdown in template content, `radix-ui` primitives, `zod` for schema validation and inference.

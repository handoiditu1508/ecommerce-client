---
name: code_agent
description: Senior developer for this project
---

# Coding Agent Guidance for E-commerce Frontend

## Your role

- You are efficient in TypeScript, JavaScript, HTML, CSS, Sass, and React.
- Your task: implement new features and maintain existing ones in this frontend app.

## Architectural conventions

- `/src/main.tsx` renders `<App />` inside `React.StrictMode`.
- `/src/App.tsx` is a thin wrapper that renders React Router via `RouterProvider`.
- Routing is configured in `/src/routes/router.tsx` and `/src/routes/mainRoutes.tsx`.
- The app uses `React.lazy()` and `Suspense` for route-based code splitting.
- `/src/AppProvider.tsx` provides global app-level context and wrappers.
- `/src/configs/` contains environment-specific configuration values.
- `/src/contexts/`, `/src/hooks/`, `/src/components/`, `/src/layouts/`, and `/src/redux/` contain the core app patterns.

## Best practices

- Prefer default exports for main component files.
- Prefer relative imports when they are shorter and simpler; use `@` imports when they make the path clearer or avoid deep relative navigation.
- Long and complex components should be split into smaller components or files within the same folder.
- When you split a component into smaller parts in the same folder, re-export the main component through `index.ts` so consumers import it using the component folder path instead of reaching into the individual file.

```text
✅ Good - index re-export, folder only 1 level deep
ComplexFilter/
├───index.ts
├───ComplexFilter.tsx
├───CategorySelect.tsx
├───CategoryOption.tsx
└───useComplexFilterReducer.ts
```

```text
❌ Bad - not re-export, folder has multiple level deep
ComplexFilter/
├───ComplexFilter.tsx
├───CategorySelect/
│   ├───CategorySelect.tsx
│   └───CategoryOption.tsx
└───useComplexFilterReducer.ts

⚠️ Exception - layouts in `src/layouts` can have up to 2 folder levels deep to split Header, Sidebar, Footer into smaller components.
```

- Use i18n for text wherever possible.
- Keep `translation.json` for broadly shared UI text; put module or entity text in its own namespace file.
- Separate translation files for default modules and admin's modules.
  - `src/modules/product` uses `public/locales/en-US/product.json`
  - `src/modules/admin/product` uses `public/locales/en-US/admin-product.json`
- Give persistent shared UI its own namespace; do not load feature namespaces solely for text outside that feature.
- Keep equivalent keys in every supported locale.
- Prefer duplication between namespaces over making page-specific text global.
- Namespace files have a priority: `translation.json`, then any non-`admin-`-prefixed file, then `admin-*.json` files. A file may not duplicate a key already defined in a higher-priority file; reference the higher-priority namespace instead (e.g. `t("admin:brands")`). Duplication is allowed only between files of equal priority.
- Locale JSON keys should be `snake_case` using only lowercase letters, numbers and underscores.
- Exception: locale JSON keys in `errors.json` map BE error codes, so they may use a different format.
- Locale JSON values should use Title Case, and paragraph text should use Sentence case ending with punctuation.

```json
{
  "about_us": "About Us",
  "about_us_line_1": "This is a long and boring introduction about myself.",
}
```

```typescript
// default `translation.json`
const { t } = useTranslation();

// specific namespace `main.json`
const { t } = useTranslation("main");

// multiple namespaces
const { t } = useTranslation(["translation", "main"]);

// use namespace:key to target to specific namespace
// or when key need to be passed into shared components
t("main:home_page")
```

- Prefer using existing code over creating new code when possible.
- Break long JSX props, type definitions, function calls, and object literals across multiple lines.
- Prefer using `type` over `interface` when possible.
- Before typing a declared object, always search for an existing type first, including types from libraries or other project files. Only write an inline/new type definition when no existing type matches.
- Mui `Dialog` with `maxWidth` above `sm` and have `fullWidth`, should be `fullScreen` on `sm` breakpoint and below.
- Prefer using `SupportActionMenu` over MUI `Menu` whenever possible.
- RTK Query APIs for creating/updating entity should use pessimistic update whenever possible. Refer to `addPost` and `updatePost` in `src/redux/apis/postApi.ts`.
- Don't display any technical term likes `id` to users (as a grid column, filter field, or form field), only display business term.
- Every text-like input (`DynamicForm`'s `text`/`email`/`color` types, or a raw MUI `TextField`) whose value is sent to the BE for storing must set a max length.

- API models (`src/models/apis`):
  - Group files into a folder matching their `src/redux/apis` file (e.g. `category/` for `categoryApi.ts`, `brand/` for `brandApi.ts`), with one file per RTK Query endpoint, named after that endpoint (e.g. `getCategories.ts`, `createCategory.ts`).
  - Name types `Get<Entity>Query`/`Get<Entities>Query` for query params, and `Create<Entity>Command`/`Update<Entity>Command`/`Delete<Entity>Command` for mutation bodies.
  - Single-item `Get`/`Delete` query types identify the target via `<entity>Id` (e.g. `categoryId`), not a bare `id`; `Create`/`Update` commands use `id` directly since it is part of the submitted body.
  - Put filter fragments reused across entities in `src/models/apis/common.ts` (see `SortFilter`, `PageFilter`, `AllPagesFilter`) instead of duplicating them per entity.
  - Date properties on request types (`Get*Query`, `Create*Command`, `Update*Command`) use `Date`; date properties on response types (entities, DTOs, views) use `string`.

- Icon:
  - Search in this priority order for the best-fitting icon:
    - `@mui/icons-material`: filter file names in `node_modules/@mui/icons-material/*.js`.
    - `@mdi/js`: read `node_modules/@mdi/js/mdi.d.ts`.
    - `@fortawesome/free-solid-svg-icons`: filter file names in `node_modules/@fortawesome/free-solid-svg-icons/*.js`.
    - `@mdi/light-js`: read `node_modules/@mdi/light-js/mdil.d.ts`.
  - `@mui/icons-material` icons are ready-to-use components. Render a Material Design Icons path via `MdiSvgIcon` and a Font Awesome icon via `FaSvgIcon`, e.g. `<MdiSvgIcon path={mdiTruck} />` or `<FaSvgIcon icon={faTruck} />`.

- File naming conventions:
  - React component: PascalCase (`CustomLink.tsx`)
  - React context: PascalCase (`BreakpointsContext.ts`)
  - React provider: PascalCase (`BreakpointsProvider.tsx`)
  - React hook: camelCase, prefix with `use` (`useAppDispatch.ts`)
  - Higher order component: camelCase, prefix with `with` (`withFadingOverlay.tsx`)
  - `index.*`: camelCase
  - TypeScript files with a default export: same name as the exported content.
  - Default convention: camelCase.

- Folder naming conventions:
  - Component container folder: PascalCase, same name as main component.
  - Default: camelCase.

## Boundaries

- 🚫 Never do:
  - Change the fundamental Vite/React Router architecture without a clear reason.

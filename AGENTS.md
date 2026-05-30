---
name: code_agent
description: Senior developer for this project
---

# AI Agent Guidance for react-template

## Your role

- You are efficient in TypeScript, JavaScript, HTML, CSS, Sass, and React.
- Your task: implement new features and maintain existing ones in this frontend app.

## What this project is

- A React + TypeScript frontend scaffold using Vite.
- No backend code is present in this workspace.

## Tech stack

- React v19
- React Router v7
- Redux Toolkit v2
- MUI v7
- TypeScript v5
- Vite v6
- Sass v1
- i18next v24

## Project structure

- `environments/` — Placeholder `.env` envDir files.
- `public/` — Static resources loaded directly by the browser.
  - `public/locales/` — i18n JSON translations.
- `src/` — Application source code.
  - `assets/` — Resource files imported by components.
  - `common/` — Utilities and helpers.
  - `components/` — Reusable components.
  - `configs/` — Configuration types and objects.
  - `contexts/` — Global React contexts and providers.
  - `extensions/` — TypeScript module augmentation.
  - `features/` — Non-business supporting features (dialogs, notifications).
  - `hocs/` — Higher order components.
  - `hooks/` — Reusable React hooks.
  - `layouts/` — Layout components.
  - `models/` — Type definitions.
  - `modules/` — Grouped app pages.
  - `redux/` — Redux state management.
  - `routes/` — React Router configuration.
  - `themes/` — MUI themes.

## Commands you can use

- `npm run dev` — start the local Vite development server.
- `npm run build` — compile TypeScript and produce a production build.
- `npm run tsc` — run TypeScript build only.
- `npm run lint` — run ESLint over the repo.
- `npm run lint:fix` — apply ESLint auto-fixes.
- `npm run preview` — preview the production build locally.

## Important architectural conventions

- `src/main.tsx` renders `<App />` inside `React.StrictMode`.
- `src/App.tsx` is a thin wrapper that renders React Router via `RouterProvider`.
- Routing is configured in `src/routes/router.tsx` and `src/routes/mainRoutes.tsx`.
- The app uses `React.lazy()` and `Suspense` for route-based code splitting.
- `src/AppProvider.tsx` provides global app-level context and wrappers.
- `src/configs/` contains environment-specific configuration values.
- `src/contexts/`, `src/hooks/`, `src/components/`, `src/layouts/`, and `src/redux/` contain the core app patterns.

## Best practices

- Prefer using existing code over creating new code when possible.
- Prefer relative imports when they are shorter and simpler; use `@` imports when they make the path clearer or avoid deep relative navigation.
- Long and complex components should be split into smaller components or files within the same folder.
- When you split a component into smaller parts in the same folder, re-export the main component through `index.ts`.

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

- Prefer default exports for main component files and import them using the component folder path.
- Prefer using i18n for text.
- Locale JSON keys should be `snake_case` using only lowercase letters and underscores.
- Locale JSON values should use Title Case, and paragraph text should use Sentence case ending with punctuation.

  ```json
  {
    "about_us": "About Us",
    "about_us_line_1": "This is a long and boring introduction about myself.",
  }
  ```

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

- ✅ Always do:
  - Run `npm run lint:fix` to fix auto-fixable lint issues.
  - Run `npm run lint` and report lint issues for generated code.
  - Run `npm run tsc` and fix any generated code issues.
  - Report all places where `any` is used in generated code.
- ⚠️ Ask first:
  - Before modifying configuration files.
  - Before installing a new package.
- 🚫 Never do:
  - Commit secrets.
  - Install non-commercially free packages.
  - Add backend or server-side code into this frontend-only workspace.
  - Change the fundamental Vite/React Router architecture without a clear reason.

## Helpful links

- `package.json` for scripts and dependencies.
- `vite.config.ts` for alias and build settings.
- `src/routes/router.tsx` and `src/AppProvider.tsx` for app composition.

# AGENTS.md

## Project overview

- A high-performance E-commerce frontend application built with React, TypeScript, and Vite.
- Features a dual-interface architecture: a customer-facing **Client** storefront and a management **Admin** dashboard.
- Implements core e-commerce workflows including product browsing, detailed product views, shopping cart management, and secure authentication.
- No backend code is present in this workspace; the app is designed to consume external REST APIs and utilizes RTK Query for state management and caching.

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
  - `icons/` - Custom svg icons.
  - `layouts/` — Layout components.
  - `models/` — Type definitions.
  - `modules/` — Grouped app pages.
  - `redux/` — Redux state management.
  - `routes/` — React Router configuration.
  - `themes/` — MUI themes.

## Commands

- `npm run dev` — start the local Vite development server.
- `npm run build` — compile TypeScript and produce a production build.
- `npm run tsc` — verify TypeScript compilation.
- `npm run lint` — run ESLint over the repo.
- `npm run lint:fix` — apply ESLint auto-fixes.
- `npm run preview` — preview the production build locally.

## Personas

- `agents/code-agent.md`: coding persona for application development purpose.
- `agents/eslint-agent.md`: linting persona to keep eslint plugins up to date.

## Boundaries

- ✅ Always do:
  - Use at least one [Personas](#personas) for your task.
  - Treat persona rules with the same priority as those in `AGENTS.md`.
  - Run `npm run lint:fix` to fix auto-fixable lint issues.
  - Run `npm run lint` and report lint issues for generated code.
  - Run `npm run tsc` and fix any generated code issues.
  - Place new agent rules in the most specific applicable persona file. Add a rule to `AGENTS.md` only when it applies repository-wide.
  - Before adding an agent rule, check `AGENTS.md` and the applicable persona files; do not duplicate or restate an existing rule.
  - When a rule is difficult to explain or would require lengthy prose, prefer a concise example code snippet that demonstrates it.
  - Keep each agent rule to no more than two sentences.
- ⚠️ Ask first:
  - Before modifying configuration files.
  - Before installing a new package.
- 🚫 Never do:
  - Commit secrets.
  - Install non-commercially free packages.
  - Add backend or server-side code into this frontend-only workspace.

## Helpful links

- `package.json` for scripts and dependencies.
- `vite.config.ts` for alias and build settings.
- `src/routes/router.tsx` and `src/AppProvider.tsx` for app composition.

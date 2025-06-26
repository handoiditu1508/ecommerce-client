# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Fetch latest code from template repository

```bash
git remote add template https://github.com/handoiditu1508/react-template
git fetch template master
git merge template/master --allow-unrelated-histories
```

## Prepare to deploy to github pages

### Create deployment branch

Create and switch to `github-pages` branch.

```bash
git checkout -b github-pages
```

### Install `gh-pages`

```bash
npm install --save-dev gh-pages
```

### Config `package.json`

Add these 2 commands.

```json
{
  // existed code
  "scripts": {
    // existed commands
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
  // existed code
}
```

*Content of `package.json`.*

### Config base path

Replace `react-template` with your repository name.

```typescript
export default defineConfig({
  base: "/react-template",
});
```

*Content of `vite.config.ts`.*

### Config router

in `src/main.tsx`, replaces `BrowserRouter` with `HashRouter`.

### Config i18n

Replace `react-template` with your repository name.

```typescript
i18n
  // existed code
  .init({
    // existed code
    interpolation: {
      // existed code
    },
    // add this field
    backend: {
      loadPath: "/react-template/locales/{{lng}}/{{ns}}.json",
    }
  });
```

*Content of `src/i18n.ts`.*

## Deploy to github pages

```bash
npm run predeploy
npm run deploy
```

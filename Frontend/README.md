# CloudUnify Pro Frontend (Vite + React 18 + TypeScript)

Lightweight, fast, and modern frontend for CloudUnify Pro using Vite, React 18, and TypeScript. Includes dark/light theming, minimal routing scaffold, and environment-based API configuration.

## Scripts

- `npm run dev` — start Vite dev server (defaults to http://localhost:3000)
- `npm run build` — production build with Vite
- `npm run preview` — preview built app locally on port 3000
- `npm run typecheck` — TypeScript type checking (no emit)

## Environment Configuration

This app reads the backend API base URL from the Vite environment variable `VITE_API_BASE`.

- Copy `.env.example` to `.env`
- Set the correct backend base URL:
  ```
  VITE_API_BASE=http://localhost:3001/v1
  ```

Note: Only variables prefixed with `VITE_` are exposed to the browser by Vite. Do not hardcode secrets or API URLs in the code.

## Project Structure

- `index.html` — Vite entry HTML
- `src/main.tsx` — React 18 entry
- `src/App.tsx` — Root App component (theme + routing)
- `src/routes.tsx` — Route definitions and nav metadata
- `src/pages/` — Placeholder pages (Home, Dashboard, Resources, Settings, Login)
- `src/config.ts` — Environment helper (`getApiBase`)
- `src/index.css` — Global styles
- `src/App.css` — Theme CSS variables and component styles

## Theming

The app supports light and dark modes using CSS variables under `:root` and `[data-theme="dark"]`. The App component toggles themes by setting the `data-theme` attribute on the `<html>` element.

## Routing

Basic routing is provided via `react-router-dom@6`:
- `/home` (default redirect)
- `/dashboard`
- `/resources`
- `/settings`
- `/login`

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Configure environment:
   ```
   cp .env.example .env
   # edit .env to set VITE_API_BASE appropriately
   ```
3. Start development server:
   ```
   npm run dev
   ```

## Notes

- This repository previously used CRA; it has been migrated to Vite + TypeScript.
- Keep API URLs externalized via `.env` files. Avoid hardcoding environment-specific values in code.

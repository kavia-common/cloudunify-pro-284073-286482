# CloudUnify Pro Frontend (Vite + React 18 + TypeScript)

Lightweight, fast, and modern frontend for CloudUnify Pro using Vite, React 18, and TypeScript. Includes dark/light theming, routing, secured API client, and accessible UI components.

## Scripts

- `npm run dev` — start Vite dev server (defaults to http://localhost:3000)
- `npm run build` — production build with Vite
- `npm run preview` — preview built app locally on port 3000
- `npm run typecheck` — TypeScript type checking (no emit)

## Running with FastAPI backend

The backend has been migrated to FastAPI and runs on port 3001 by default.

Quick start:
1) Start the FastAPI backend:
```
cd Backend/fastapi_app
# (optional) create/activate venv and install: pip install -r requirements.txt
# export required env (see Backend/.env.example)
uvicorn app.main:app --host 0.0.0.0 --port 3001 --reload
# or:
python serve.py
```

2) Configure the frontend to point at the backend:
- Copy `.env.example` to `.env`
- Ensure:
```
VITE_API_BASE=http://localhost:3001
```

3) Start the frontend:
```
npm install
npm run dev
```

Notes:
- Only variables prefixed with `VITE_` are exposed to the browser by Vite. Do not hardcode secrets or API URLs in the code.
- In preview environments, ensure the backend sets `PREVIEW_MODE=true` and `CORS_ORIGIN` includes your Frontend URL (or `*` for development).

## Environment Configuration

This app reads the backend API base URL from the Vite environment variable `VITE_API_BASE`.

- Copy `.env.example` to `.env`
- Set the correct backend base URL:
  ```
  VITE_API_BASE=http://localhost:3001
  ```

Notes:
- Only variables prefixed with `VITE_` are exposed to the browser by Vite. Do not hardcode secrets or API URLs in the code.
- The app expects the backend to expose endpoints such as `/auth/login`, `/users/me`, `/users`, `/organizations`, and `/resources`.

## Project Structure

- `index.html` — Vite entry HTML
- `src/main.tsx` — React 18 entry
- `src/App.tsx` — Root App component (theme + routing + layout)
- `src/routes.tsx` — Route definitions and navigation metadata
- `src/components/` — Reusable components
  - `Navbar.tsx` — Top navigation bar (brand, nav links, theme toggle, user menu)
  - `Sidebar.tsx` — Responsive sidebar for primary navigation
  - `ThemeToggle.tsx` — A11y-friendly theme switcher
  - `ResourceTable.tsx` — Sortable/paged resource table
  - `ErrorBoundary.tsx` — Catches render errors with a fallback
  - `ProtectedRoute.tsx` — Auth gate (redirects to login if needed)
- `src/pages/` — App pages (Home, Dashboard, Resources, Resource Detail, Organizations, Users, Settings, Login)
- `src/config.ts` — Environment helper (`getApiBase`)
- `src/lib/apiClient.ts` — Axios instance with JWT and global 401 handling
- `src/store/auth.tsx` — Minimal auth provider (login/logout/me)
- `src/types.ts` — Shared TypeScript types
- `src/index.css` — Global styles
- `src/App.css` — Theme variables and layout styles

## Theming & Accessibility

- Light and dark modes via CSS variables on `:root` and `[data-theme="dark"]`.
- Keyboard-accessible navigation and controls (skip-link, a11y labels, aria attributes).
- Reduced-motion friendly styling and responsive layout (mobile sidebar is hidden; navbar links are visible on smaller screens).

## Routing

Provided via `react-router-dom@6`:
- `/home` (default redirect)
- `/dashboard` (protected)
- `/resources` (protected)
- `/resources/:id` (protected)
- `/organizations` (protected)
- `/users` (protected)
- `/settings` (protected)
- `/login`

## Authentication & 401 Handling

- Login uses `POST /auth/login`.
- JWT token is stored under `localStorage` key `cloudunify_auth_token`.
- The axios client injects the Bearer token on each request.
- On `401 Unauthorized`, the client clears the session and redirects to `/login`.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Configure environment:
   ```
   cp .env.example .env
   # edit .env to set VITE_API_BASE appropriately (e.g., http://localhost:3001)
   ```
3. Start development server:
   ```
   npm run dev
   ```

## Notes

- Keep API URLs externalized via `.env` files. Avoid hardcoding environment-specific values in code.
- This repository has been migrated to Vite + TypeScript. Use `npm run typecheck` to validate types.

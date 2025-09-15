# Copilot Instructions for AI Agents

## Project Overview
- **Stack:** React (frontend), Vite (build), custom API client, TypeScript types for API, modular component structure.
- **Domain:** E-commerce platform with admin and customer flows, authentication, product management, and order processing.

## Key Architecture & Patterns
- **Frontend Entrypoint:** `src/main.jsx` (mounts `App.jsx`)
- **Layouts:**
  - `src/layouts/` contains `AdminLayout.jsx`, `AuthLayout.jsx`, `CustomerLayout.jsx` for role-based UI separation.
- **Pages:**
  - Route-based pages in `src/pages/` (e.g., `admin/products/index.jsx`, `auth/sign-in.jsx`).
- **Components:**
  - Organized by domain: `src/components/admin/`, `src/components/auth/`, `src/components/customer/`.
- **API Integration:**
  - API client logic in `src/config/api.js` and `src/utils/apiClient.js`.
  - TypeScript types for API in `types/api-types.ts` (import and use for all API data).
  - Mock API for local development: `src/mocks/` (see `browser.js`, `handlers/`).

## Developer Workflows
- **Start Dev Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Lint:**
  ```bash
  npm run lint
  ```
- **Mock API:**
  - Uses MSW (Mock Service Worker) for local API mocking. See `src/mocks/` and `public/mockServiceWorker.js`.
- **Type Safety:**
  - Always use types from `types/api-types.ts` for API data and responses.

## Project Conventions
- **API Responses:**
  - Always expect `{ status: boolean, data?: any, message?: string, errors?: ValidationError[] }`.
- **Authentication:**
  - Bearer token in `Authorization` header; role-based access (USER, ADMIN).
- **Versioning:**
  - Use `X-API-Version: 1.0` in all API requests.
- **Error Handling:**
  - Use HTTP status codes and descriptive messages; see backend validation example in `docs/README.md`.
- **Pagination:**
  - Standard pagination fields: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`.

## Integration Points
- **API Client Example:** See `docs/README.md` and `src/utils/apiClient.js` for patterns.
- **Type Definitions:** All API types in `types/api-types.ts`.
- **Mock Data:** For local dev, use `src/mocks/data/mockData.js`.

## When Updating API or Types
1. Update `types/api-types.ts`
2. Update `docs/API_SCHEMA.md`
3. Follow semantic versioning

## References
- Main docs: `docs/README.md`, `docs/API_SCHEMA.md`
- Roadmap: `ROADMAP.md`
- Entry: `src/main.jsx`, `src/App.jsx`
- Layouts: `src/layouts/`
- API: `src/config/api.js`, `src/utils/apiClient.js`
- Types: `types/api-types.ts`

---
For more, see the full documentation in `docs/README.md` and code comments in key files.
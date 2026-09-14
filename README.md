# FixItNow

A service marketplace that connects customers with local technicians — plumbers, electricians, handymen — for booking, scheduling, and paying for home repair jobs. Three roles, one app: customers book and pay, technicians publish services and availability, admins verify technicians and oversee the platform.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4, backed by a separate Express + Prisma API.

## Features

**Public**
- Browse and filter services by search term, category, price, location, and technician rating, with pagination
- Browse technicians, sorted verified-first
- Service and technician detail pages with availability, reviews, and booking

**Customer**
- Book a service against a technician's published slot
- Pay via SSLCommerz, with retry on a failed or abandoned attempt
- Track bookings, payment history, and leave reviews on completed jobs
- Edit profile with instant, optimistic UI feedback

**Technician**
- Publish services under an admin-defined category
- Publish availability as time slots, generated from a start/end window and slot length
- Accept or decline booking requests, and progress a job from paid → in progress → completed

**Admin**
- Approve or block technicians
- Block or unblock any account
- Create categories
- Platform-wide visibility into users, bookings, and payments, with drill-down detail pages

**Cross-cutting**
- Role-based dashboards — visiting another role's dashboard renders a real 404, not a redirect
- A signed-in user is redirected away from `/login` and `/register`
- Session-aware navbar and footer
- Toast feedback on every mutation
- A skeleton loading state shaped to match nearly every route

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn (`base-maia` style) on Base UI primitives |
| Forms & state | Server Actions, `useActionState`, `useOptimistic` |
| Icons | Remix Icon |
| Toasts | Sonner |
| Language | TypeScript |
| Backend | Express + Prisma (separate repository), JWT access/refresh auth |
| Payments | SSLCommerz |

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in the values below
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `BACKEND_API_URL` | Base URL of the FixItNow API (e.g. `http://localhost:5000` in development, or the deployed API's URL in production) |

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Project structure

Routes are grouped by domain under `app/`, each group owning its own actions, components, and config:

```
app/
  (auth)/              login, register — no navbar/footer, full-bleed layout
  (public)/            home, services, technicians — browsing & booking
  (dashboard)/         customer, technician and admin dashboards + shared profile
components/
  ui/                  shadcn primitives (button, card, sidebar, …)
  shared/              Navbar, Footer — used across route groups
service/               cross-cutting auth/session helpers (see below)
lib/                   shared types (lib/types.ts) and small helpers
```

Within a route group:

```
app/(dashboard)/
  _actions/
    admin/             admin-only mutations & reads
    technician/        technician-only mutations & reads
    user/              actions any signed-in role can call
  _components/         components private to this group
  _config/             local config (e.g. status → label/tone maps)
  <role>-dashboard/    one folder per role, each with its own layout.tsx
                       that gates access by role and 404s a mismatch
```

Every route has a route-shaped `loading.tsx`; the shared card/table skeleton pieces live in `_components/`.

### The auth/session layer (`service/`)

- **`getCurrentUser`** — resolves the signed-in user from the `accessToken` cookie. Wrapped in React's `cache()` so a layout and its page can both call it in one request for one network hit.
- **`authorizedRequest`** — the single path every authenticated call goes through. Attaches the bearer token; if the request fails, refreshes the token once and retries before giving up — so a stale token recovers silently instead of surfacing an error.
- **`refreshAccessToken`** — calls the refresh endpoint and persists the new token. Cookie writes only succeed when called from a Server Action, per Next.js's own rule; a refresh triggered by a plain page render still serves that request correctly, it just can't durably save the new cookie until the next action does.
- **`logout`** — clears both cookies and revalidates the app shell so every open tab reflects the change.

## A note on this codebase

This project runs on a pre-release Next.js build with breaking changes from the Next.js you may already know — see [`AGENTS.md`](./AGENTS.md), which points at the bundled docs in `node_modules/next/dist/docs/`. Notably: **Middleware is now called Proxy** (`proxy.ts`), and several `next/cache` functions (`revalidateTag`'s `{ expire }` option, `updateTag`, `refresh`) behave differently from their well-known counterparts.

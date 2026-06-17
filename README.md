# MIG Digital Ecosystem

Three-app digital ecosystem for Magastu Indoprime Group (MIG) — Indonesia's spice trade. Consists of a marketing landing page + two SaaS platforms for spice trade buyers and exporters.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/landing-page/` — MIG marketing landing page (previewPath `/`)
- `artifacts/thinkspices/` — ThinkSpices buyer intelligence platform (previewPath `/thinkspices/`)
- `artifacts/intradex/` — InTradeX export execution platform (previewPath `/intradex/`)
- `artifacts/api-server/` — Express API server (path `/api`)
- `lib/db/` — Drizzle ORM schema and DB connection
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod validation schemas

## Architecture decisions

- All three frontend apps are frontend-only (no backend calls) — Landing Page uses Supabase, InTradeX uses Firebase + Google GenAI, ThinkSpices uses Google GenAI
- ThinkSpices and InTradeX source files are flat in `src/` (all components as siblings) — original GitHub repos had them at root without subdirectory structure
- Tailwind v4 used for ThinkSpices and InTradeX; Landing Page originally v3 but converted to v4 `@import` syntax
- InTradeX extra deps: `firebase`, `@google/genai`, `jspdf`; ThinkSpices extra deps: `@google/genai`, `recharts`
- ThinkSpices banner image lives at `artifacts/thinkspices/assets/images/thinkspices_banner.png`

## Product

- **Landing Page**: Marketing site connecting global buyers with MIG's two platforms
- **ThinkSpices**: B2B spice sourcing intelligence — verified supplier network, live FOB pricing, AI-assisted RFQ generation, origin comparison, harvest intelligence, trade glossary
- **InTradeX**: Export execution companion — FOB/CIF/DDP cost calculators, trade document generation (PDF), Firebase auth (Google sign-in), AI trade advisor, RFQ inbox, market price tracker

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- All ThinkSpices and InTradeX component files are siblings in `src/` — do not create subdirectories
- When editing ThinkSpices/InTradeX components, use relative imports like `./ComponentName` not `./components/layout/ComponentName`
- ThinkSpices `LandingPage.tsx` imports the banner image from `../assets/images/thinkspices_banner.png` (relative to `src/`)
- InTradeX uses Firebase — config is at `src/firebase-applet-config.json` (public keys from GitHub)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.agents/memory/mig-flat-repo.md` for the import-flattening rules when re-importing source files

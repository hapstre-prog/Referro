# Base44 Dev Environment — Relay AI Referral Network

## Stack
- **Runtime:** Node 22 (Express + Vite middleware mode, single-origin on port 3000)
- **Frontend:** React 19 + Vite 6 + Tailwind 4 (via `@tailwindcss/vite`)
- **Backend:** `server.ts` — Express API with in-memory state (no database)
- **AI:** `@google/genai` (Gemini) — optional, has graceful fallbacks when `GEMINI_API_KEY` is absent

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- Installs npm deps at container startup, then runs `npx tsx server.ts`.
- Vite runs in middleware mode through Express — serves both API (`/api/*`) and the SPA from the same origin.
- Live reload works via Vite HMR (bind-mounted source).
- Health check: `GET /api/health`

## Secrets
- `GEMINI_API_KEY` — only external secret. App boots and renders without it; AI endpoints return fallback responses. Provide via the Base44 secrets dashboard to enable real Gemini calls.
- All other `.env.example` keys (DATABASE_URL, STRIPE_*, LINKEDIN_*, EMAIL_API_KEY, AUTH_SECRET) are not used at runtime — the app uses in-memory state and mock/demo responses.

## Notes
- `node_modules` is an anonymous volume to avoid host/platform clobbering container-installed deps.
- No migrations or seeds needed — seed data is hardcoded in `src/data/seedData.ts` and loaded into memory at server start.

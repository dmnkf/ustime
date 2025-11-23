# Implementation Plan - Self-Hosted Backend (Railway)

To meet the requirement of **self-hosting on Railway**, we will build a lightweight custom backend instead of using Supabase (which is resource-heavy to self-host).

## Stack
- **Frontend**: Vite (React) - Already built.
- **Backend**: Node.js with **Hono** (lightweight, fast).
- **Auth**: **Better Auth** (handles Google/Apple SSO).
- **Database**: **PostgreSQL** (hosted on Railway).
- **ORM**: **Drizzle ORM**.
- **Realtime**: **WS** (WebSockets) via Hono.

## User Review Required
> [!IMPORTANT]
> **Railway Project**: You will need a Railway project with a PostgreSQL database.
> **Env Vars**: You will need to provide `DATABASE_URL`, `GOOGLE_CLIENT_ID/SECRET`, and `APPLE_CLIENT_ID/SECRET`.

## Proposed Changes

### 1. Backend Setup (`/server`)
We will create a separate server entry point.
- Initialize Hono server.
- Setup Drizzle with Postgres connection.
- Configure Better Auth.

### 2. Database Schema (Postgres)
Define tables using Drizzle:
- `user`: Auth data (managed by Better Auth).
- `session`: Session data.
- `account`: OAuth accounts.
- `verification`: Email verification.
- `profile`: App-specific user data (partner code).
- `pitch`: Activity pitches.

### 3. Authentication (Better Auth)
- Configure Google and Apple providers.
- Expose auth endpoints (`/api/auth/*`).

### 4. Real-time (WebSockets)
- Implement a simple WS handler in Hono.
- Clients connect to WS to receive "Pitch" events.

### 5. Frontend Integration
- Update `App.tsx` to fetch data from our new API instead of LocalStorage/Supabase.
- Create a `api-client.ts` (using Hono RPC or standard fetch).
- Connect to WebSocket for realtime updates.

## Verification Plan
1. **Local Dev**: Run `npm run dev:server` (backend) and `npm run dev` (frontend).
2. **Auth**: Login with Google (mocked locally or real).
3. **Flow**: Connect devices and send a pitch via WebSocket.
4. **Deploy**: Push to Railway and verify production build.

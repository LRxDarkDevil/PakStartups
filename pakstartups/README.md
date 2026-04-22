# PakStartups

PakStartups is an open, community-built platform for Pakistan's startup ecosystem.

The goal is to connect founders, students, freelancers, SMEs, and ecosystem partners through practical tools for discovery, collaboration, and execution.

## Status

- Framework: Next.js App Router + TypeScript
- Backend services: Firebase (Auth + Firestore + Storage)
- Current stage: Active build, open for contributors

This project is usable in development, but still incomplete in multiple feature areas. See `MISSING_PAGES.md` for currently known gaps.

## What You Can Help Build

High-impact areas for contributors:

- Admin modules and moderation workflows
- Idea validation tools and survey flows
- Matchmaking requests and saved profiles
- B2B marketplace and ecosystem expansion pages
- Knowledge hub sub-sections and resource curation
- API validation/auth hardening and test coverage

## Roadmap

We maintain a contributor-focused roadmap in `ROADMAP.md`.

Current focus:

- Phase 1: Foundation hardening (API validation, auth checks, Firestore rules)
- Phase 2: Core product completion (admin, matchmaking, ideas, B2B)
- Phase 3: Content and knowledge expansion
- Phase 4: Reliability, testing, and performance

If you are looking for a place to start, pick one scoped item from `MISSING_PAGES.md` and cross-check priorities in `ROADMAP.md`.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Firebase Web SDK
- Tailwind CSS 4

## Quick Start

### 1. Prerequisites

- Node.js 20+
- npm 10+
- A Firebase project (for full functionality)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `./.env.local.example` to `./.env.local` and fill values:

```bash
cp .env.local.example .env.local
```

Required values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional:

- `NEXT_PUBLIC_FIREBASE_MESSUREMENT_ID` (analytics)

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `app/` - Routes and UI pages (App Router)
- `components/` - Shared UI and layout components
- `lib/` - Firebase config, auth context, hooks, services
- `scripts/` - Seeding/admin utility scripts
- `public/` - Static assets

## Open Source Workflow

Please read these before contributing:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `ROADMAP.md`

## Security Note

Do not commit real secrets. Keep local credentials in `.env.local` only.

If you discover a vulnerability, do not open a public issue. Follow `SECURITY.md`.

## License

This project is licensed under the MIT License. See `LICENSE`.

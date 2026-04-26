# PakStartups — Fixes Checklist

All non-working features, missing pages, and broken buttons identified in the audit.

---

## Auth

- [x] Remove email/password login — keep Google only (`app/auth/login/page.tsx`)
- [x] Remove email/password signup — keep Google only (`app/auth/signup/page.tsx`)
- [x] Update Security Settings page — remove password-change form since all users are now Google (`app/settings/security/page.tsx`)

---

## Buttons With No Handlers

- [x] "View Profile" button in Admin Volunteers — show applicant detail modal (`app/admin/volunteers/page.tsx`)
- [x] "Load More Demands" button in B2B Marketplace — add pagination state (`app/b2b/page.tsx`)
- [x] "Read Story" button on featured Blog post — link to post detail page (`app/blog/page.tsx`)

---

## Ecosystem Directory Filters

- [x] Category tabs (Incubators, Accelerators, etc.) — add active state + filter logic (`app/ecosystem/EcosystemDirectoryClient.tsx`)
- [x] Region filter buttons (Karachi, Lahore, etc.) — add active state + filter logic (`app/ecosystem/EcosystemDirectoryClient.tsx`)

---

## Stub / Empty Pages

- [x] Knowledge Hub → Learning Guides (`app/knowledge/guides/page.tsx`)
- [x] Knowledge Hub → Operational Toolkit (`app/knowledge/toolkit/page.tsx`)
- [x] Knowledge Hub → Market Intelligence Reports (`app/knowledge/reports/page.tsx`)
- [x] Knowledge Hub → Resource Directory (`app/knowledge/directory/page.tsx`)
- [x] Ideas → Feasibility Tool (`app/ideas/feasibility/page.tsx`)
- [x] Ideas → Survey Builder (`app/ideas/survey/page.tsx`)
- [x] Ideas → MVP Resources (`app/ideas/resources/page.tsx`)

---

## Blog Detail Page

- [x] Create blog post detail page — `/blog/[id]` route (`app/blog/[id]/page.tsx`)
- [x] Add `getPostById` to blog service (`lib/services/blog.ts`)
- [x] Make blog post cards clickable — link to `/blog/[id]`

---

## Admin Panel

- [x] Volunteer Management — load real data from Firestore `volunteerApplications` collection (`app/admin/volunteers/page.tsx`)
- [x] Reports — replace chart placeholder with real bar chart (`app/admin/reports/page.tsx`)

---

## API

- [x] Match API route — wire to Firestore instead of returning hardcoded stub profiles (`app/api/match/route.ts`)

---

## Future / Won't Fix Now

- [ ] Two-Factor Authentication — Firebase does not natively support TOTP 2FA in client SDK; deferred until backend infra is ready

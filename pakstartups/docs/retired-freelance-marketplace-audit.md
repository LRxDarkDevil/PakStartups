# Retired freelancing marketplace audit

Date: 2026-07-22

## Decision

The former freelancing-marketplace concept is retired. The `Freelancer` value remains an intentional public profile role inside co-founder and community matchmaking. It describes a person's working background; it does not represent a job listing, gig marketplace, bidding, contracting, or payment workflow.

## Repository audit scope

The `development` branch was reviewed across:

- `app/match/page.tsx`
- `lib/services/match.ts`
- `app/settings/page.tsx`
- `app/admin/users/page.tsx`
- `scripts/seed.mjs`
- `scripts/seed-client.mjs`
- public navigation, dashboard, sitemap, documentation, Firebase-related configuration, and indexed repository search

Search concepts included `Freelancer`, `freelance`, `freelancing marketplace`, `gig`, `job listing`, `hire freelancer`, `bid`, `proposal`, `contract`, and `payout`.

## Findings

- No freelance-job, gig, bidding, proposal, contract, escrow, payout, or marketplace route is present in the active application.
- No marketplace-specific service, collection, data loader, submission form, admin action, dashboard CTA, navigation item, sitemap entry, or seed command was identified.
- `MatchProfile.role` intentionally accepts `Freelancer` alongside Founder, Tech Lead, Student, and Mentor.
- `/match` uses the role only to filter open matchmaking profiles. Saved profiles and connection requests continue to operate on profile UIDs and are independent of marketplace behavior.
- Settings allows a user to identify their public primary role as Freelancer; this is profile metadata used for community discovery.
- Admin and seed references classify user or match-profile roles and do not create freelance jobs or marketplace records.
- General README wording that includes freelancers among the platform audience is consistent with community participation and does not promise a freelance marketplace.

## Preserved behavior

The following behavior must remain supported unless a later product decision explicitly changes the profile taxonomy:

1. Users can select Freelancer as their public role.
2. Freelancer profiles can appear in `/match` when open to connections.
3. Visitors can filter matchmaking results by Freelancer.
4. Freelancer profiles can be saved and can send or receive connection requests.
5. Existing stored profiles with `role: "Freelancer"` remain valid and require no migration.

## Legacy route and data handling

No retired marketplace route file remains. Unknown legacy URLs therefore resolve through the application's normal not-found behavior. A redirect is not introduced because no verified replacement route exists.

No obsolete marketplace collection is represented in repository code or Firebase configuration. Unknown historical production data must not be deleted blindly. If a legacy collection is later found through authorized production inspection, it should be exported, checked for active readers/writers, archived, and removed only through an explicit owner-approved migration.

## Regression verification

The repository-level data flow was checked as follows:

- role selection in `/match` passes the selected value to `getMatchProfiles`;
- the service queries open profiles and applies role/city filtering;
- client-side search includes role, name, city, skills, and matching intent;
- saved-profile loading remains UID-based;
- sent and received connection requests remain UID-based;
- settings persists the selected role to the user's public profile;
- no marketplace-only dependency is required by these paths.

## Reintroduction guardrail

Any future freelance marketplace must be approved and implemented as a separate bounded feature with its own routes, data model, authorization, moderation, payments/legal review, navigation, analytics, and migration plan. It must not be inferred from or coupled to the existing `Freelancer` matchmaking role.

# Startup demo and testimonial content audit

## Scope

This audit supports Orbicue task ORB-DUVU7 and covers the startup directory service, startup seed scripts, static homepage mock content, and the remaining production-data verification requirement.

## Record-origin policy

Startup records use the following explicit origins:

- `verified`
- `community-submitted`
- `nominated`
- `testimonial-demo`
- `partner-sponsored`

Records marked `testimonial-demo` or `isDemo: true` are excluded from normal startup directory queries. Historical records without origin metadata remain visible until an authorized production audit classifies them, avoiding accidental removal of legitimate listings.

New founder submissions are persisted as `community-submitted` with `isDemo: false` at the startup service boundary.

## Seed-script protections

Both startup seed paths are demo-only and refuse to initialize Firebase unless all safeguards pass:

- `DEMO_SEED_ENABLED=true` is explicitly set.
- `DEMO_SEED_PROJECT_ID` is explicitly supplied.
- The acknowledged project matches the configured Firebase project.
- Seeded startup fixtures are written as `recordType: testimonial-demo` and `isDemo: true`.

The seed scripts were reviewed but were not executed during the automation runs because they perform database writes and no Firebase target was authorized.

## Intentional homepage mock content

The following values in `components/home/HomePageClient.tsx` are illustrative interface mockups, not verified production records:

- `PayEasy`
- `Zainab Raza`
- `TaxFast PK`
- `+38% MoM`
- `96% Skills Match`
- `Rs. 15,000`
- `30% OFF`

The homepage now displays a visible disclosure before these cards explaining that they are not verified startup listings, real profiles, measured performance claims, approved partners, or live commercial offers.

These values must not be copied into the `startups`, `matchProfiles`, ecosystem, partner, or commercial-offer collections as production records. Any future testimonial, sponsored, or partner content must use explicit origin/sponsorship metadata and must remain visibly distinguishable from verified organic records.

## Image and story handling

The hero mock cards currently use icons and initials rather than startup logos or founder photographs, so they do not create an image-to-identity mapping that could be mistaken for a verified person or company.

The separate Founder Stories section loads published content from the blog service rather than using the hero mock records. Its content accuracy therefore depends on the blog moderation/publishing workflow and is outside the static hero fixture set documented here.

## Remaining production verification

The repository implementation cannot confirm that historical dummy records are absent from the live Firestore `startups` collection. Completion requires authorized Firebase access to:

1. Export or otherwise record the current production startup inventory before making destructive changes.
2. Identify records matching known fixtures or other fabricated/stale content.
3. Classify intentional demo/testimonial records with `recordType: testimonial-demo` and `isDemo: true`, or remove confirmed obsolete dummy records.
4. Confirm sponsored records use `partner-sponsored` and are visually disclosed.
5. Re-run the normal directory query and verify no demo record appears in production results.
6. Record the reviewed record IDs and outcome in the Orbicue completion comment without exposing sensitive contact data.

No destructive production action should be taken without authorized credentials and a reviewed inventory/export.

## Deployment notes

The homepage disclosure is a normal application change and requires the usual deployment of the `development` branch through the project's approved release process. It requires no Firestore rule, index, or migration change.

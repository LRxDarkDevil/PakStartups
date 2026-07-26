# Retired service-industry and agency-job surfaces audit

Date: 2026-07-22

## Scope

This audit covers the active application routes, navigation, sitemap, repository-indexed source, seed scripts, Firebase-related configuration, admin surfaces, and project documentation for remnants of a former service-industry or agency-job product.

Search terms included `job`, `jobs`, `job board`, `career`, `hiring`, `vacancy`, `employment`, `service industry`, `agency job`, and `agency`.

## Findings

- There is no active jobs, careers, vacancies, hiring, or employment route in the current application.
- The public header does not link to a jobs or service-industry destination.
- The generated sitemap does not publish a jobs, careers, or agency-job URL.
- No application-level job collection, job data loader, job submission flow, job admin screen, or job seed command was found in the indexed repository code.
- Matches for `jobs` under engineering-agent reference material and CI workflow examples are development documentation/tooling, not PakStartups product functionality.
- Matches for `agency` in the B2B page and seed data describe legitimate agency/service-provider organizations in the active B2B product. They are not an agency-job marketplace and must not be removed as part of this retirement.

## Legacy route behavior

Because no retired route files or redirects remain, requests to unknown legacy paths such as `/jobs`, `/careers`, or `/agency-jobs` are intentionally handled by Next.js as not-found responses. No redirect is added because there is no verified replacement destination, and inventing one could mislead users.

## Historical data decision

No jobs collection or migration path is represented in the current repository. Any unknown historical production data must be retained untouched rather than deleted blindly. If a legacy collection is later identified through an authorized production-data audit, the safe default is:

1. export it with timestamps and document counts;
2. verify that no deployed code reads or writes it;
3. archive access before considering deletion;
4. require an explicit owner-approved deletion plan for destructive cleanup.

No production data mutation is performed by this repository-only task.

## Verification checklist

- [x] Public header reviewed.
- [x] Sitemap reviewed.
- [x] Repository-indexed source searched for job/employment terminology.
- [x] Seed and B2B agency references classified to avoid deleting active behavior.
- [x] No active jobs UI, route, loader, service, admin action, or documented product promise identified.
- [x] Unknown legacy URLs retain intentional 404 behavior.
- [x] Historical production data is explicitly preserved pending an authorized audit.

## Follow-up guardrail

Future jobs or service-industry functionality should be introduced only through a new approved product task. New routes, collections, navigation links, sitemap entries, seed data, and admin controls should be reviewed together so a partial or orphaned implementation cannot reappear.
# PakStartups Roadmap

This roadmap is designed for open-source contributors. It highlights what needs to be built next, why it matters, and where contributions are most useful.

## Principles

- Ship small, reviewable slices
- Prioritize security and data integrity
- Favor production-ready flows over placeholder pages
- Keep docs and implementation in sync

## Phase 1: Foundation Hardening (Now)

Goal: Make the project safe and contributor-friendly.

### Milestones

1. API hardening
- Add input validation for all write endpoints
- Enforce auth checks on protected actions
- Standardize API error response shapes

2. Firestore rules hardening
- Tighten permissive create/update paths
- Add rule-level validation for required fields
- Verify owner/admin boundaries

3. Contributor experience
- Add issue templates and pull request template
- Label and break down tasks from `MISSING_PAGES.md`
- Improve setup troubleshooting docs

### Definition of done

- No write endpoint accepts unvalidated request bodies
- Rules reviewed for privilege escalation and abuse vectors
- New contributor can run app locally in under 15 minutes

## Phase 2: Core Product Completion

Goal: Complete critical user and ecosystem workflows.

### Milestones

1. Admin management suite
- Users, blog moderation, volunteer reviews, event moderation, reports

2. Matchmaking and collaboration
- Connection requests inbox
- Saved founder profiles

3. Idea validation flow
- Idea submission, feasibility workflow, survey builder, resource pages

4. B2B and ecosystem growth
- List solution flow
- Ecosystem organization add flow

### Definition of done

- End-to-end user journeys exist for each module
- Each flow has loading/error/empty states
- Data writes are permissioned and auditable

## Phase 3: Content and Knowledge Expansion

Goal: Make PakStartups practically useful for founders every week.

### Milestones

1. Knowledge hub expansion
- Guides, toolkit, reports, grants/resources directory

2. Startup profile quality
- Improve startup detail pages with richer structured sections

3. Editorial and community content operations
- Strong blog review and publication process
- Content quality and taxonomy standards

### Definition of done

- Knowledge sections are navigable and consistently structured
- Contributors can add/update resources via clear workflows

## Phase 4: Reliability and Scale

Goal: Prepare for larger contributor and user volume.

### Milestones

1. Testing strategy
- Add integration tests for high-risk APIs
- Add regression tests for auth and rules-sensitive flows

2. Observability and operations
- Add logging and error monitoring baseline
- Define incident response and rollback notes

3. Performance and UX polish
- Improve page-level loading performance
- Address accessibility and mobile usability gaps

### Definition of done

- Critical flows have automated test coverage
- Runtime issues are discoverable and actionable
- User-facing performance is measurably improved

## Priority Contribution Areas

If you want to help immediately, start here:

1. API validation and auth guard implementation
2. Firestore rules review and tightening
3. Admin workflow completion pages
4. Match requests and saved profiles
5. Idea submission and feasibility experience

## How to Pick a Task

1. Check `MISSING_PAGES.md`
2. Pick one route/flow and keep scope narrow
3. Open a draft PR early for alignment
4. Include test notes and screenshots in PR

## Out of Scope for Early Contributors

- Large architectural rewrites
- Framework migrations
- Broad visual redesigns without product alignment

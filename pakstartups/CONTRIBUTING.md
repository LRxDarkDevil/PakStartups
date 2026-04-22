# Contributing to PakStartups

Thanks for helping build Pakistan's startup ecosystem infrastructure.

## Before You Start

- Read `README.md` for setup instructions.
- Check `MISSING_PAGES.md` for known feature gaps.
- Search open issues to avoid duplicate work.

## Contribution Types

We welcome:

- Feature implementation
- Bug fixes
- Security hardening
- Documentation improvements
- Tests and quality improvements
- UX/accessibility improvements

## Local Setup

1. Fork the repository
2. Clone your fork
3. Create `.env.local` from `.env.local.example`
4. Install dependencies with `npm install`
5. Start the app with `npm run dev`

## Branch Naming

Use clear branch names, for example:

- `feat/match-requests-page`
- `fix/startup-api-validation`
- `docs/readme-improvements`

## Commit Messages

Use concise, descriptive commits:

- `feat: add events moderation table`
- `fix: enforce auth check on startup create`
- `docs: improve local setup guide`

## Pull Request Checklist

Before opening a PR:

1. Run `npm run lint` and fix issues.
2. Verify your change works locally.
3. Keep PR scope focused on one logical change.
4. Update docs if behavior/setup changed.
5. Add screenshots for UI changes.

In your PR description include:

- What changed
- Why it changed
- How to test it
- Any follow-up work

## Coding Guidelines

- Use TypeScript consistently.
- Prefer small, composable functions.
- Avoid introducing dead code and unused deps.
- Do not commit secrets or credentials.
- Preserve existing style unless a refactor is part of the PR.

## Good First Contributions

If you are new, start with:

- Missing page implementations listed in `MISSING_PAGES.md`
- Form validation improvements
- Loading/error state polish
- API request/response typing improvements
- Documentation cleanup

## Security Issues

Please do not report security vulnerabilities in public issues.

Follow `SECURITY.md` for responsible disclosure.

## Community Expectations

By participating, you agree to follow `CODE_OF_CONDUCT.md`.

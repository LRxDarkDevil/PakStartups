# Security Policy

## Supported Versions

This project is under active development. Security fixes are applied to the
latest default branch.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Instead:

1. Open a private GitHub Security Advisory for this repository.
2. Include reproduction steps, impact, and any proof-of-concept details.
3. Share mitigation suggestions if available.

You can expect:

- Initial acknowledgement within 72 hours
- A triage update after validation
- A coordinated fix/release plan for confirmed issues

## Preferred Report Contents

Please include:

- Vulnerability type and affected component
- Exact file/path and endpoint (if applicable)
- Steps to reproduce
- Impact assessment (data exposure, privilege escalation, etc.)
- Proposed fix or mitigations

## Security Best Practices for Contributors

- Never commit secrets, tokens, keys, or credentials.
- Keep local env values in `.env.local` only.
- Add input validation and auth checks for any new API routes.
- Avoid logging sensitive user or credential data.
- Use least-privilege access when working with Firebase rules.

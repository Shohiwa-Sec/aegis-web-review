# Aegis Web Review Roadmap

## Phase 1: Dashboard Foundation

Goal: Create a polished product interface that clearly communicates the purpose of the tool.

Planned work:

- Build React and TypeScript dashboard.
- Add URL input area.
- Show sample scan result.
- Display findings with severity labels.
- Add category-based risk summaries.
- Create initial README and project documentation.

Status: In progress.

## Phase 2: Website Scanner MVP

Goal: Scan a public website URL and generate real findings from deterministic checks.

Planned checks:

- HTTPS availability.
- HTTP security headers.
- Content Security Policy presence.
- Privacy Policy link detection.
- Terms of Service link detection.
- Contact form detection.
- Cookie or tracking script detection.
- External script inventory.
- AI chatbot or AI-assistance language detection.
- Risky claim language detection.

Expected output:

- Overall readiness score.
- Security score.
- Privacy score.
- Compliance risk score.
- AI trust score.
- Findings grouped by category.
- Plain-English explanations and recommended fixes.

## Phase 3: AI-Generated Website Risk Rules

Goal: Add checks that specifically target common mistakes in AI-built websites.

Planned checks:

- Placeholder content left in production.
- Fake or unverifiable testimonials.
- Missing owner identity or support path.
- Newsletter form without consent language.
- File upload with no data handling policy.
- Chatbot with no AI disclaimer.
- Login/admin routes discoverable from public navigation.
- Overconfident medical, legal, financial, or security claims.

## Phase 4: Codebase Review Mode

Goal: Add optional local code scanning for users who want to review source files.

Planned checks:

- Exposed secrets in frontend code.
- Private environment variables referenced in browser files.
- Dangerous React patterns such as `dangerouslySetInnerHTML`.
- Open redirect patterns.
- API routes with missing authentication checks.
- Risky Supabase Row Level Security assumptions.
- Suspicious dependencies.

## Phase 5: Report Generation

Goal: Make scan results easier to share and discuss.

Planned features:

- Exportable report view.
- Executive summary.
- Technical findings section.
- Recommended launch checklist.
- Severity distribution.
- Evidence snippets.
- Remediation guidance.

## Phase 6: GitHub and Deployment Polish

Goal: Make the project portfolio-ready.

Planned work:

- Add screenshots.
- Add architecture diagram.
- Add sample scan report.
- Add demo video or GIF.
- Add GitHub repository topics.
- Add clear setup instructions.
- Deploy public demo.

## Possible Future Enhancements

- GitHub repository import.
- Authenticated scan history.
- Supabase-backed project storage.
- OpenAI-assisted remediation explanations.
- CI integration.
- Scheduled rescans.
- Team workspaces.
- Rule configuration.
- Compliance templates for different business types.

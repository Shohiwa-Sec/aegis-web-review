# Architecture

## High-Level Design

Aegis Web Review is planned as a React and TypeScript application with a scanner engine that evaluates websites using deterministic rules.

The system has four major parts:

- User interface.
- Scanner orchestration.
- Rule engine.
- Report generation.

## User Interface

The frontend provides the main scan workflow:

- Enter a website URL.
- Start a scan.
- View category scores.
- Review individual findings.
- Read recommended fixes.
- Export or share results in future versions.

The interface is designed to be clear for non-security users while still presenting enough technical detail to be credible for developers.

## Scanner Orchestration

The scanner orchestration layer is responsible for collecting website evidence and passing it through rule checks.

Planned responsibilities:

- Normalize and validate target URLs.
- Fetch the homepage.
- Collect response headers.
- Parse HTML.
- Extract links, forms, scripts, and metadata.
- Identify likely policy pages.
- Send collected evidence to scanner rules.
- Combine rule results into a final report.

## Rule Engine

The rule engine evaluates evidence using deterministic checks. This keeps the first version understandable, testable, and explainable.

Each rule should define:

- Rule ID.
- Category.
- Severity.
- Detection logic.
- Evidence.
- Plain-English explanation.
- Recommended fix.

Example categories:

- Security.
- Privacy.
- Compliance risk.
- AI trust.
- Code quality.

## Finding Model

A finding should include:

- Title.
- Severity.
- Category.
- Description.
- Evidence.
- Why it matters.
- Recommended fix.
- Confidence level.

## Scoring Model

The initial scoring model should be simple and explainable.

Possible approach:

- Start each category at 100.
- Subtract points based on severity.
- Critical findings subtract the most.
- Low findings subtract the least.
- Display both category scores and overall readiness.

The score should be framed as a launch-readiness signal, not as a guarantee of legal compliance or security.

## Legal and Safety Framing

Aegis Web Review should use careful language:

- Say "risk signal" instead of "legal violation."
- Say "recommended review" instead of "required by law" unless a specific jurisdiction is known.
- Say "not legal advice" in reports and documentation.
- Avoid claiming that a site is fully compliant.

## Future Backend

The MVP can begin as a frontend demo with sample data. A future backend can provide:

- URL fetching without browser CORS limitations.
- Scan history.
- Authentication.
- Project storage.
- Scheduled scans.
- Report exports.

Possible backend stack:

- Node.js server.
- Supabase for auth and scan history.
- Server-side scanner workers.
- OpenAI API for optional explanation generation.

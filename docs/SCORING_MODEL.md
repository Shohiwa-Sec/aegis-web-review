# Scoring Model

Aegis uses two separate scores: Readiness and Reliability.

## Readiness Score

The Readiness Score measures how clean the site is against Aegis launch-review checks.

It is reduced by findings based on:

- Severity.
- Confidence.
- Business impact.
- Category.
- Expected cost if ignored.

This score is intentionally more punitive for findings that could create expensive business or legal problems.

Examples of higher-impact issues:

- Missing Terms of Service on a commercial or AI-related site.
- Missing Privacy Policy when forms or tracking scripts are present.
- AI advice without limitation language.
- Risky claims involving medical, legal, financial, guaranteed, or 100% accurate language.
- Missing HTTPS.

## Reliability Score

The Reliability Score measures observable maturity and trust posture.

It gives credit for positive public signals such as:

- HTTPS usage.
- Successful public response.
- Security headers.
- Privacy Policy detection.
- Terms of Service detection.
- Contact/support path detection.
- Multi-page evidence collection.

This helps distinguish mature platforms from small launch pages. A mature site may have minor readiness notes while still showing high reliability.

## Why Two Scores?

A single score can be misleading.

Readiness asks:

> What should be fixed before launch?

Reliability asks:

> How mature and trustworthy does the public website posture appear?

Together, they give a more balanced review.

## Grade Scale

- A: 90-100.
- B: 80-89.
- C: 70-79.
- D: 60-69.
- F: below 60.

## Compliance Language

Aegis uses phrases like "risk signal" and "potentially implicated guidance" because legal applicability depends on jurisdiction, business model, data collection, audience, and context.

Aegis does not provide legal advice.

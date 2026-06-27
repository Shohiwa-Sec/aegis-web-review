# Security and Compliance Scope

## Purpose

Aegis Web Review is designed to identify common security, privacy, compliance, and trust risk signals in AI-generated websites.

The tool is not a legal authority, compliance certification system, or professional penetration testing replacement. It is a practical first-pass review tool for builders who want to catch obvious issues before launch.

## Security Review Areas

Initial security checks should focus on passive, non-destructive review:

- HTTPS support.
- Security response headers.
- Content Security Policy presence.
- Mixed content indicators.
- External JavaScript sources.
- Suspicious secrets in page source or bundled scripts.
- Public admin or login surface indicators.
- Open redirect patterns.
- Unsafe form behavior.

## Privacy Review Areas

Privacy checks should focus on whether the site clearly explains data collection and tracking behavior.

Potential checks:

- Privacy Policy link exists.
- Contact form is present.
- Newsletter form is present.
- Cookie or tracking scripts are present.
- Data collection is explained near forms.
- Third-party analytics scripts are disclosed.
- Upload or chatbot features mention data handling.

## Compliance Risk Areas

Compliance checks should be framed as risk signals, not legal conclusions.

Potential checks:

- Missing Terms of Service.
- Missing Privacy Policy.
- Missing cookie notice when tracking appears present.
- Missing refund or cancellation policy for paid products.
- Missing business contact information.
- Missing age restriction language when relevant.
- Regulated-topic claims without disclaimers.

## AI Trust Review Areas

AI-generated websites may include product features or copy that create trust and safety concerns.

Potential checks:

- AI chatbot present without disclosure.
- AI-generated advice without disclaimer.
- Medical, legal, financial, or safety claims.
- Guaranteed outcome language.
- Fake testimonial patterns.
- No clear owner, company, or support contact.
- User uploads with no data retention explanation.

## Severity Guide

Critical:

The issue may expose sensitive data, create a major security risk, or seriously mislead users.

High:

The issue creates meaningful security, privacy, or compliance risk and should be fixed before launch.

Medium:

The issue is important but may depend on site context, jurisdiction, or business model.

Low:

The issue is a best-practice gap or documentation weakness that should be improved.

## Language Guidelines

Use careful wording:

- "Potential risk" instead of "violation."
- "May require review" instead of "illegal."
- "Consider adding" instead of "must add" when jurisdiction is unknown.
- "Not legal advice" in all compliance-oriented reports.

## Authorized Use

Users should scan only:

- Their own websites.
- Client websites they are authorized to review.
- Test projects.
- Demo projects.
- Intentionally vulnerable sample websites.

The tool should not automate exploitation, credential attacks, destructive testing, or scans against systems where the user lacks permission.

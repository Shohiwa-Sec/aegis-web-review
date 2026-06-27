# Contributing

Aegis Web Review is currently a portfolio project, but the codebase is organized so future contributors can add scanner rules, UI improvements, and reporting features.

## Development Setup

```bash
npm install
npm run dev
```

## Build Check

```bash
npm run build
```

## Adding A Scanner Rule

A good scanner rule should include:

- Clear detection logic.
- Evidence that supports the finding.
- Severity.
- Confidence.
- Business impact.
- Recommended fix.
- Step-by-step remediation.
- References to standards, laws, or guidance when relevant.

## Rule Writing Principles

- Avoid overclaiming.
- Use "risk signal" language for compliance issues.
- Prefer explainable deterministic checks.
- Include evidence snippets whenever possible.
- Keep passive scanning boundaries intact.

## Safety

Do not add exploit logic, credential attacks, brute force checks, denial-of-service behavior, or bypass techniques.

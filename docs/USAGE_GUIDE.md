# Usage Guide

## Running Aegis Locally

From WSL / Ubuntu:

```bash
cd "/mnt/c/Users/shohiwa/Documents/AI vulnerability scanner 2"
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Keep the terminal running while using the app.

## Running A Scan

1. Enter a website URL in the target field.
2. You can type either a full URL or a bare domain.
3. Example inputs:
   - `https://example.com`
   - `youtube.com`
   - `my-ai-app.com`
4. Aegis normalizes bare domains to HTTPS before scanning.
5. Review the readiness grade, reliability score, site profile, category scores, and findings.

## Understanding Results

Aegis separates results into four categories:

- Security.
- Privacy.
- Compliance.
- AI Trust.

Each finding includes:

- Severity.
- Confidence.
- Business impact.
- Fix difficulty.
- Evidence snippet.
- Why it matters.
- Recommended fix.
- Step-by-step remediation.
- Research links to relevant standards or guidance.

## Scan History

Scan history is stored locally in your browser. It is not uploaded anywhere.

The History section shows:

- Target URL.
- Readiness grade.
- Readiness score.
- Reliability score.
- Scan timestamp.

Clicking a history item reloads that report in the dashboard.

## Exporting A Report

Use the Export Report button to download a Markdown report.

The report includes:

- Target URL.
- Grade.
- Readiness score.
- Reliability score.
- Verdict.
- Site profile.
- Top priorities.
- Findings.
- Reference links.

## Important Limitations

Aegis performs passive public-page review. It cannot prove that a site is legally compliant or secure. Some sites may block scanner requests, hide policies behind scripts, or serve different content by region.

Treat results as launch-readiness signals and research prompts, not final legal or security conclusions.
